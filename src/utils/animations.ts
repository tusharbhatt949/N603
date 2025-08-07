//@ts-nocheck
import { scene } from "../main";
import { ANIMATION_GROUPS, getMeshByName } from "./utils";
interface AnimationConfig {
    name: string;
    sequence: number;
    speed: number;
    loop: boolean;
    startFrame: number;
    endFrame: number | null;
    reverse: boolean;
    noOfIterations?: number;
    onIterationComplete?: (iterationNo: number) => void;
    onComplete?: () => void; // Optional callback when animation completes
}


let textureObserver: BABYLON.Observer<BABYLON.Scene> | null = null;
let pausedAnimations: BABYLON.AnimationGroup[] = []

type AnimationGroupsMap = Record<number, AnimationConfig[]>; // Grouped by sequence

export const prepareAndPlayAnimations = (animations: AnimationConfig[]): void => {
    if (!animations || animations.length === 0) return;

    // Sort animations by sequence number
    animations.sort((a, b) => a.sequence - b.sequence);

    // Group animations by sequence
    const groupedAnimations: AnimationGroupsMap = {};
    animations.forEach((anim) => {
        if (!groupedAnimations[anim.sequence]) {
            groupedAnimations[anim.sequence] = [];
        }
        groupedAnimations[anim.sequence].push(anim);
    });

    const sequenceKeys = Object.keys(groupedAnimations).map(Number).sort((a, b) => a - b);

    if (sequenceKeys.length > 0) {
        playAnimationsInSequence(sequenceKeys, groupedAnimations);
    }
};
function playAnimationsInSequence(
    sequenceKeys: number[],
    groupedAnimations: AnimationGroupsMap,
    index: number = 0
): void {
    if (index >= sequenceKeys.length) return; // Stop when all sequences are played

    const currentSequence = sequenceKeys[index];
    const animationsToPlay = groupedAnimations[currentSequence];

    let completedCount = 0; // Track finished animations
    const nonLoopingAnimations = animationsToPlay.filter((anim) => !anim.loop);

    animationsToPlay.forEach((animation) => {
        const animationToPlay = ANIMATION_GROUPS.find((a) => a.name === animation.name);

        if (animationToPlay) {
            let playCount = 0;
            const maxPlays = animation.noOfIterations || 1; // Default to 1 iteration if not specified

            const playAnimation = () => {
                if (playCount >= maxPlays) {

                    // Call onComplete function if defined
                    if (typeof animation.onComplete === "function") {
                        animation.onComplete();
                    }

                    completedCount++;
                    if (completedCount === nonLoopingAnimations.length) {
                        playAnimationsInSequence(sequenceKeys, groupedAnimations, index + 1); // Start next sequence
                    }
                    return; 
                }

                playCount++;

                if(animation.iterationEndFrame && playCount == maxPlays) {
                    animationToPlay.start(animation.loop, 1, animation.startFrame, animation.iterationEndFrame);
                }

                if (animation.endFrame !== null) {
                    animationToPlay.start(animation.loop, 1, animation.startFrame, animation.endFrame);
                } else {
                    animationToPlay.start(animation.loop, 1);
                }
                

                animationToPlay.speedRatio = animation.speed;

                animationToPlay.onAnimationGroupEndObservable.addOnce(() => {

                    // Call onIterationComplete function if defined
                    if (typeof animation.onIterationComplete === "function") {
                        animation.onIterationComplete(playCount);
                    }

                    // Add a small delay before starting the next play to avoid overlapping
                    setTimeout(playAnimation, 50); // 50ms delay
                });
            };

            playAnimation(); // Start first play
        } else {
            completedCount++;
            if (completedCount === nonLoopingAnimations.length) {
                playAnimationsInSequence(sequenceKeys, groupedAnimations, index + 1);
            }
        }
    });
}

export const pauseAnimations = () => {
    pausedAnimations = []; // Reset stored animations

    scene.animationGroups.forEach((animGroup) => {
        if (animGroup.isPlaying) {
            animGroup.pause();
            // @ts-ignore
            pausedAnimations.push(animGroup); // Store paused animations
        }
    });
    stopTextureAnimation();

    scene.animatables.forEach((anim) => {
        // @ts-ignore
        if (anim.isPlaying) {
            anim.pause();
            // @ts-ignore
            pausedAnimations.push(anim); // Store paused animatables
        }
    });

}

// **Resume previously paused animations**
export const resumeAnimations = () => {
    pausedAnimations.forEach((anim) => anim.play());
    pausedAnimations = []; // Clear the stored list
    animateRoad(); // Restart road animation

}

export const resetAnimations = () => {
    ANIMATION_GROUPS.forEach(animation => {
        animation.onAnimationGroupEndObservable.clear();
        animation.goToFrame(0);
        animation.reset();
        animation.stop();
    });
}

export const animateRoad = (): void => {
    roadAnimationSpeed = 0.5; // Store speed globally
    const material = scene.getMaterialByName("Hill_Hold") as BABYLON.StandardMaterial | null;

    if (material) {

        Object.keys(material).forEach((key) => {
            const property = (material as any)[key]; // Use type assertion to access dynamic properties
            if (property instanceof BABYLON.Texture) {
                // @ts-ignore
                animateTexture(property, scene);
            }
        });
    }
};

let roadAnimationSpeed = 0.5; // Store speed globally

const animateTexture = (texture: BABYLON.Texture, scene: BABYLON.Scene): void => {
    if (textureObserver) return; // ✅ Prevent duplicate observers

    textureObserver = scene.onBeforeRenderObservable.add(() => {
        const deltaTime: number = scene.getEngine().getDeltaTime() / 1000;
        texture.vOffset -= roadAnimationSpeed * deltaTime; // ✅ Uses controlled speed
    });
    texture.metadata = { isSlowing: false }
};

export const stopTextureAnimation = (): void => {
    if (textureObserver) {
        // @ts-ignore
        scene.onBeforeRenderObservable.remove(textureObserver);
        textureObserver = null;
    }
};


export const slowAndStopAnimation = async (animationNames: string[]): Promise<void> => {
    const promises: Promise<void>[] = [];

    // Slow down animation groups
    animationNames.forEach(name => {
        const group = ANIMATION_GROUPS.find(g => g.name === name);
        if (group) {
            const promise = new Promise<void>((resolve) => {
                const interval = setInterval(() => {
                    if (group.speedRatio > 0.01) {
                        group.speedRatio *= 0.9; // Gradually decrease speed
                    } else {
                        group.speedRatio = 0; // Stop completely
                        clearInterval(interval);
                        resolve(); // ✅ Resolve when animation stops
                    }
                }, 15);
            });
            promises.push(promise);
        }
    });

    // Slow down the road texture animation
    if (animationNames.includes("roadAnim")) {
        const material = scene.getMaterialByName("Hill_Hold") as BABYLON.StandardMaterial | null;
        if (material) {
            Object.keys(material).forEach((key) => {
                const property = (material as any)[key];
                if (property instanceof BABYLON.Texture) {
                    promises.push(slowDownTexture(property)); // ✅ Wait for texture slowdown
                }
            });
        }
    }

    await Promise.all(promises); // ✅ Wait until everything has stopped
};



export const restoreAnimationSpeed = (animations: { name: string; speed: number }[]): void => {
    animations.forEach(({ name, speed }) => {
        // ✅ Restore speed of animation groups
        const group = ANIMATION_GROUPS.find(g => g.name === name);
        if (group) {
            const interval = setInterval(() => {
                if (group.speedRatio < speed) {
                    group.speedRatio += (speed - group.speedRatio) * 0.1; // Gradually increase
                } else {
                    group.speedRatio = speed; // Ensure exact value
                    clearInterval(interval);
                }
            }, 50);
            return; // ✅ Skip to the next animation
        }

        // ✅ Restore road texture speed
        if (name === "roadAnim") {
            const material = scene.getMaterialByName("Hill_Hold") as BABYLON.StandardMaterial | null;
            if (material) {
                for (const key in material) {
                    const property = (material as any)[key];
                    if (property instanceof BABYLON.Texture) {
                        speedUpTexture(property, speed);
                        break; // 🚀 Exit loop after first texture
                    }
                }
            }
        }
    });
};


// Function to slow down the road texture animation
const slowDownTexture = (texture: BABYLON.Texture): Promise<void> => {
    return new Promise<void>((resolve) => {

        // If already slowing down, return to prevent duplicates
        if (texture.metadata?.isSlowing) return resolve();
        texture.metadata = { isSlowing: true }; // Mark texture as slowing

        const interval = setInterval(() => {
            if (roadAnimationSpeed > 0.01) {
                roadAnimationSpeed *= 0.9; // Gradually reduce speed
            } else {
                roadAnimationSpeed = 0;
                clearInterval(interval);
                resolve(); // ✅ Resolve promise when animation stops
            }
        }, 50);
    });
};


// Function to gradually speed up road texture animation
const speedUpTexture = (texture: BABYLON.Texture, targetSpeed: number): void => {
    if (texture.metadata?.isSpeeding) {
        return;
    }
    texture.metadata = { isSpeeding: true };

    const maxStep = 0.01; // Prevents sudden jumps
    const interval = setInterval(() => {
        if (roadAnimationSpeed < targetSpeed - 0.001) { // Prevent overshooting
            roadAnimationSpeed += Math.min(maxStep, targetSpeed - roadAnimationSpeed);
        } else {
            roadAnimationSpeed = targetSpeed; // Ensure exact value
            clearInterval(interval);
            texture.metadata.isSpeeding = false; // ✅ Reset flag
        }
    }, 50);
};

export const shineAnimation = async (
    materialName: string,
    offsetFrom: number,
    offsetTo: number,
    duration: number,
    albedoColor?: string
) => {
    const material = scene.getMaterialByName(materialName) as unknown as BABYLON.StandardMaterial | BABYLON.PBRMaterial;
    if (!material) {
        return;
    }

    if (albedoColor)
        changeEmissiveColor(materialName, albedoColor);
    // Get the texture (StandardMaterial: emissiveTexture, PBRMaterial: albedoTexture)
    const texture: any = (material as BABYLON.StandardMaterial).emissiveTexture || (material as BABYLON.PBRMaterial).albedoTexture;
    if (!texture) {
        return;
    }

    // Store the original offset value
    const originalOffset = texture.uOffset;

    // Stop existing animation if already running
    const existingAnimation = texture.animations?.find((anim: { name: string; }) => anim.name === "shineAnimation");
    if (existingAnimation) {
        scene.stopAnimation(texture);
    }

    const animation = new BABYLON.Animation(
        "shineAnimation",
        "uOffset",
        60, // FPS
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );

    const keys = [
        { frame: 0, value: offsetFrom },
        { frame: duration, value: offsetTo }
    ];

    animation.setKeys(keys);

    // Assign animation
    texture.animations = [animation];

    // Start the animation and reset texture offset after completion
    scene.beginAnimation(texture, 0, duration, false, 1, () => {
        texture.uOffset = originalOffset; // Reset to original value
    });
};

export const changeEmissiveColor = (materialName: string, emissiveColor: string) => {
    const material = scene.getMaterialByName(materialName);

    if (!material) {
        return;
    }

    const color = BABYLON.Color3.FromHexString(emissiveColor);

    if (material instanceof BABYLON.PBRMaterial) {
        (material as BABYLON.PBRMaterial).emissiveColor = color;
    } else if (material instanceof BABYLON.StandardMaterial) {
        (material as BABYLON.StandardMaterial).emissiveColor = color;
    } else {
    }
};

import { Animation, Scene, Mesh } from "@babylonjs/core";

export const blinkAnimation = (meshName: string, duration: number = 1000) => {
    const mesh = getMeshByName(meshName);
    if (!mesh) return;

    const animationName = `blinkAnimation_${mesh.name}`;

    // Check if the animation already exists
    const existingAnimation = mesh.animations.find(anim => anim.name === animationName);
    if (existingAnimation) {
        scene.beginAnimation(mesh, 0, 12, true, duration / 1000);
        return;
    }

    // Create a new animation only if it doesn't exist
    const animation = new Animation(
        animationName,
        "visibility",
        10, // FPS
        Animation.ANIMATIONTYPE_FLOAT,
        Animation.ANIMATIONLOOPMODE_CYCLE
    );

    // **Instant Visibility Switching (No Smooth Transition)**
    const keys = [
        { frame: 0, value: 1 },   // Fully visible
        { frame: 5, value: 1 },   // Stay visible for 0.5 sec
        { frame: 6, value: 0 },   // Instantly invisible
        { frame: 11, value: 0 },  // Stay invisible for 0.5 sec
        { frame: 12, value: 1 },  // Instantly visible again
    ];
    animation.setKeys(keys);

    // **Disable Smooth Interpolation**
    animation.enableBlending = false; // Prevents smooth transitions

    // Add the animation to the mesh
    //@ts-ignore
    mesh.animations.push(animation);

    // Start the animation
    scene.beginAnimation(mesh, 0, 12, true, duration / 1000);
};



export const makeSceneDarkAnimation = () => {
    if (!scene) return;

    // **Check if IBL intensity animation exists**
    //@ts-ignore
    let iblAnimation = scene.animations.find((anim) => anim.name === "iblIntensityAnimation") as Animation;

    if (!iblAnimation) {
        iblAnimation = new Animation(
            "iblIntensityAnimation",
            "environmentIntensity",
            60,
            Animation.ANIMATIONTYPE_FLOAT,
            Animation.ANIMATIONLOOPMODE_CONSTANT
        );

        const iblKeys = [
            { frame: 0, value: scene.environmentIntensity },
            { frame: 60, value: 0.45 },
        ];
        iblAnimation.setKeys(iblKeys);
        scene.animations.push(iblAnimation);
    }

    // **Restart animation**
    scene.beginDirectAnimation(scene, [iblAnimation], 0, 60, false);

    // **Enable and animate fog**
    scene.fogMode = Scene.FOGMODE_EXP;
    scene.fogColor = BABYLON.Color3.FromHexString("#000000").toLinearSpace(); // Convert to Color3
    scene.fogDensity = 0;

    let fogAnimation = scene.animations.find((anim) => anim.name === "fogDensityAnimation") as Animation;

    if (!fogAnimation) {
        fogAnimation = new Animation(
            "fogDensityAnimation",
            "fogDensity",
            60,
            Animation.ANIMATIONTYPE_FLOAT,
            Animation.ANIMATIONLOOPMODE_CONSTANT
        );

        const fogKeys = [
            { frame: 0, value: scene.fogDensity },
            { frame: 60, value: 0.007 },
        ];
        fogAnimation.setKeys(fogKeys);
        scene.animations.push(fogAnimation);
    }

    // **Restart fog animation**
    scene.beginDirectAnimation(scene, [fogAnimation], 0, 60, false);

    // **Animate Directional Light Intensity**
    const directionalLight = scene.lights.find((light) => light instanceof BABYLON.DirectionalLight) as BABYLON.DirectionalLight;
    if (directionalLight) {
        let lightAnimation = scene.animations.find((anim) => anim.name === "lightIntensityAnimation") as Animation;

        if (!lightAnimation) {
            lightAnimation = new Animation(
                "lightIntensityAnimation",
                "intensity",
                60,
                Animation.ANIMATIONTYPE_FLOAT,
                Animation.ANIMATIONLOOPMODE_CONSTANT
            );

            const lightKeys = [
                { frame: 0, value: directionalLight.intensity },
                { frame: 60, value: 1 },
            ];
            lightAnimation.setKeys(lightKeys);
            scene.animations.push(lightAnimation);
        }

        // **Restart light animation**
        scene.beginDirectAnimation(directionalLight, [lightAnimation], 0, 60, false);
    }
};


export const resetSceneLighting = () => {
    if (!scene) return;

    const defaultIBLIntensity = 2; // Updated from 2 → 4
    const defaultFogDensity = 0.0;
    const defaultLightIntensity = 4; // Restore directional light to default

    // **Check if values are already at default**
    if (
        scene.environmentIntensity === defaultIBLIntensity &&
        scene.fogDensity === defaultFogDensity
    ) {
        return; // Already reset, no need to animate
    }

    // **IBL Animation Reset**
    let iblResetAnimation = new Animation(
        "iblResetAnimation",
        "environmentIntensity",
        60,
        Animation.ANIMATIONTYPE_FLOAT,
        Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    const iblResetKeys = [
        { frame: 0, value: scene.environmentIntensity },
        { frame: 60, value: defaultIBLIntensity },
    ];
    iblResetAnimation.setKeys(iblResetKeys);
    scene.animations.push(iblResetAnimation);
    scene.beginDirectAnimation(scene, [iblResetAnimation], 0, 60, false);

    // **Fog Animation Reset**
    let fogResetAnimation = new Animation(
        "fogResetAnimation",
        "fogDensity",
        60,
        Animation.ANIMATIONTYPE_FLOAT,
        Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    const fogResetKeys = [
        { frame: 0, value: scene.fogDensity },
        { frame: 60, value: defaultFogDensity },
    ];
    fogResetAnimation.setKeys(fogResetKeys);
    scene.animations.push(fogResetAnimation);
    scene.beginDirectAnimation(scene, [fogResetAnimation], 0, 60, false);

    // **Reset Directional Light Intensity**
    const directionalLight = scene.lights.find((light) => light instanceof BABYLON.DirectionalLight) as BABYLON.DirectionalLight;
    if (directionalLight) {
        let lightResetAnimation = new Animation(
            "lightResetAnimation",
            "intensity",
            60,
            Animation.ANIMATIONTYPE_FLOAT,
            Animation.ANIMATIONLOOPMODE_CONSTANT
        );

        const lightResetKeys = [
            { frame: 0, value: directionalLight.intensity },
            { frame: 60, value: defaultLightIntensity },
        ];
        lightResetAnimation.setKeys(lightResetKeys);
        scene.animations.push(lightResetAnimation);

        scene.beginDirectAnimation(directionalLight, [lightResetAnimation], 0, 60, false);
    }
};

import * as BABYLON from "babylonjs";
import "babylonjs-loaders";
import { ASSETS } from "../constants/assets";

let speedLines1: BABYLON.ParticleSystem | null = null;
let speedLines2: BABYLON.ParticleSystem | null = null;

export const animateSpeedLines = async () => {
    try {
        // Load JSON files
        const particle1 = await (await fetch(ASSETS.OTHERS.particleSystemLeft)).json();
        const particle2 = await (await fetch(ASSETS.OTHERS.particleSystemRight)).json();

        // Create the first particle system
        speedLines1 = BABYLON.ParticleSystem.Parse(particle1, scene);
        speedLines1.emitter = new BABYLON.Vector3(0, 0, 0); // Adjust position

        // Create the second particle system
        speedLines2 = BABYLON.ParticleSystem.Parse(particle2, scene);
        speedLines2.emitter = new BABYLON.Vector3(0, 1, 0); // Adjust position
        // stopSpeedLines()
        console.log("✅ Speed Lines Particles Loaded!");
    } catch (error) {
        console.error("❌ Error loading particle systems:", error);
    }
};

// ✅ Start showing the speed lines
export const startSpeedLines = () => {
    if (speedLines1 && speedLines2) {
        speedLines1.start();
        speedLines2.start();
        console.log("🚀 Speed Lines Started!");
    }
};

// ❌ Stop/hide the speed lines
export const stopSpeedLines = () => {
    if (speedLines1 && speedLines2) {
        speedLines1.stop();
        speedLines2.stop();
        console.log("🛑 Speed Lines Stopped!");
    }
};


export function animateUScaleToZero(materialName: string, duration: number = 1000) {
    const material = scene.getMaterialByName(materialName);
  
    if (!material || !("albedoTexture" in material) || !material.albedoTexture) {
      console.warn(`Material "${materialName}" not found or has no albedoTexture.`);
      return;
    }
  
    const texture = material.albedoTexture;
  
    const frameRate = 60;
    const totalFrames = (duration / 1000) * frameRate;
  
    const animation = new Animation(
      "uScaleAnimation",
      "uScale",
      frameRate,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CONSTANT
    );
  
    animation.setKeys([
      { frame: 0, value: 1 },
      { frame: totalFrames, value: 0 },
    ]);
  
    scene.beginDirectAnimation(texture, [animation], 0, totalFrames, false);
  }