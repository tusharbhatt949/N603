import { Camera, Color3, Color4, DefaultRenderingPipeline, GlowLayer, NodeMaterial, PBRMaterial, Scene, StandardMaterial } from "babylonjs";
import { ASSETS } from "../constants/assets";
import { FeatureCategory, ModeType, VehicleColors } from "../constants/enums";
import { subFeatureTabsData } from "../constants/subFeatureTabsData";
import { CABIN_VIEW_CAMERA_POINTS, CAMERA_DESKTOP_LOWER_BETA_LIMIT, CAMERA_DESKTOP_LOWER_RADIUS_LIMIT, CAMERA_DESKTOP_UPPER_BETA_LIMIT, CAMERA_DESKTOP_UPPER_RADIUS_LIMIT, IS_DEV_ENV, MESHES_TO_HIDE_ON_LOAD, PLAY_PAUSE_TOGGLE_COOLDOWN } from "../constants/values";
import { camera, canvas, scene } from "../main";
import { resumeProgressBar, pauseProgressBar } from "../uiElements/autoModeTimeline/autoModeTimeline";
import { hideChargingInfographics } from "../uiElements/infographics/chargingText";
import { hideExitButton, setCurrentCategoryAndSubCategory, showExitButton, updatePlaybackButtonState } from "../uiElements/infographics/ExitButton";
import { hideRangeInfographics } from "../uiElements/infographics/rangeText";
import { hideStaticText } from "../uiElements/infographics/staticText";
import { deselectMainCategory, deselectSubcategoryItem, scrollToSubcategoryItemByIndex } from "../uiElements/sidebar/sidebar";
import { animateRoad, pauseAnimations, prepareAndPlayAnimations, resetAnimations, resetSceneLighting, resumeAnimations, stopSpeedLines, stopTextureAnimation } from "./animations";
import { CURRENT_MODE, switchBackToManualMode, toggleMode } from "./autoManualMode";
import { normalizeAlpha, pauseCameraRotation, resumeCameraRotation, rotateCamera, setCameraLimits, setCameraToDeafultPosition, stopRotateCamera360 } from "./cameraRotation";
import { resetOutlineHighlight, resetTransparencyMode, stopAllHighlights } from "./highlights";
import { createHotspots, hideHotspots, showHotspots } from "./hotspots";
import { pauseAudio, playVoiceOver, resumeAudio, stopCurrentAudio } from "./voiceovers";
import { pauseZoomIn, resumeZoomIn, stopZoomIn, zoomInSmooth } from "./zoomInEffect";

export let ANIMATION_GROUPS: BABYLON.AnimationGroup[] = []
export let AUTO_MODE_PAUSED = false;
export let INSIDE_CABIN_VIEW = false;
export let VEHICLE_MESHES: BABYLON.AbstractMesh[] = [];
let autoModeCooldown = false; // Cooldown flag

export const deSelectCurrentSidebarMenuItem = () => {
    const tabsContainer = document.getElementById("subfeature-tabs-container") as HTMLDivElement;
    const tabs = document.getElementById("tabs") as HTMLDivElement;
    const tabContent = document.getElementById("tab-content") as HTMLDivElement;
    if (!tabs || !tabContent || !tabsContainer) return;
    tabs.innerHTML = "";
    tabContent.innerHTML = "";
    tabsContainer.classList.add("hidden");
    setCameraToDeafultPosition();
    resetSceneState();
}

export const selectSidebarMenuItem = (category: FeatureCategory) => {
    renderTabs(category)
};

export const renderTabs = (category: FeatureCategory) => {
    const tabsContainer = document.getElementById("subfeature-tabs-container") as HTMLDivElement;
    const tabs = document.getElementById("tabs") as HTMLDivElement;
    const tabContent = document.getElementById("tab-content") as HTMLDivElement;

    if (!tabs || !tabContent || !tabsContainer) return;

    // Reset previous tabs
    tabs.innerHTML = "";
    tabContent.innerHTML = "";
    tabsContainer.classList.remove("hidden");

    if (subFeatureTabsData[category]) {
        subFeatureTabsData[category].forEach((_tab: any, index: number) => {
            const tabElement = document.createElement("div");
            tabElement.className = "tab";
            tabElement.textContent = (index + 1).toString();
            tabElement.addEventListener("click", () => selectTab(category, index));

            tabs.appendChild(tabElement);
        });

        // Select the first tab by default
        selectTab(category, 0);
    }
};

export const selectTab = async (category: FeatureCategory, index: number, modeType = ModeType.MANUAL) => {

    resetSceneState()
    displayTabContent(category, index);
    camera.detachControl();
    showExitButton();
    scrollToSubcategoryItemByIndex(category, index);
    setCurrentCategoryAndSubCategory(category, index);
    enableVignette();
    updatePlaybackButtonState()
    const feature = subFeatureTabsData[category][index];
    let cameraValues = feature.camera
    const highlightMesh = feature.highlightMesh
    hideHotspots();

    // @ts-ignore
    const showMesh = feature.showMesh
    // @ts-ignore
    const isRoadAnim = feature.isRoadAnim
    // @ts-ignore
    const meshesToHide = feature.hideMesh
    // @ts-ignore
    const zoomEffect = feature.zoomEffect

    if (!cameraValues)
        return;

    if (meshesToHide) {
        hideMeshes(meshesToHide);
    }

    //@ts-ignore
    if (feature.manualConfig && CURRENT_MODE == ModeType.MANUAL && feature.manualConfig.isMobile == isMobileDevice()) {
        //@ts-ignore
        cameraValues = feature.manualConfig.camera;
    }

    //@ts-ignore
    if (cameraValues.fov) {
        //@ts-ignore
        animateFOV(cameraValues.fov)
    }

    await rotateCamera({
        alpha: cameraValues.alpha ?? 0,
        beta: cameraValues.beta ?? 0,
        radius: cameraValues.radius ?? 10,
        target: {
            x: cameraValues.x ?? 0,
            y: cameraValues.y ?? 0,
            z: cameraValues.z ?? 0
        },
        resetToDefaultPositionFirst: false,
    });




    // if camera didn't reach its destination, return
    // const normalizedAlpha = normalizeAlpha(camera.alpha, cameraValues.alpha);

    const clippedCameraValues = clipCameraValuesToLimits(cameraValues)

    if (camera.radius != clippedCameraValues.radius || camera.beta != clippedCameraValues.beta) {
        return
    }

    if (modeType == ModeType.AUTO) {
        displaySubtitles(category, feature);
    }

    if (showMesh) {
        showMesh.forEach((meshName: string) => {
            makeMeshVisible(meshName);
        });
    }

    if ("animations" in feature && Array.isArray(feature.animations)) {
        const animations = feature.animations;
        prepareAndPlayAnimations(animations);
    }

    if (highlightMesh)
        highlightMesh()

    if (zoomEffect != false) {
        //@ts-ignore
        const zoomInSpeed = feature.zoomInSpeed
        if (zoomInSpeed) {
            zoomInSmooth(9000, zoomInSpeed);

        } else
            zoomInSmooth();

    }

    if (isRoadAnim) {
        animateRoad();
    }

    if (modeType === ModeType.AUTO) {
        await playVoiceOver(category, index);
    } else {
        playVoiceOver(category, index);
    }

};

export const resetSceneState = () => {
    stopAllHighlights();
    resetAnimations();
    stopZoomIn();
    stopTextureAnimation();
    stopCurrentAudio();
    showAllMeshes();
    resetTransparencyMode();
    hideRangeInfographics();
    hideChargingInfographics();
    rejectSleep();
    resetFov();
    resetSceneLighting();
    stopSpeedLines();
    hideStaticText();
    hideExitButton();
    disableVignette();
    stopRotateCamera360();
    resetOutlineHighlight();
    stopAllTextureAnimations();
    resetModifiedMeshesRenderingGroupId();

    camera.attachControl(canvas, true);

    if (INSIDE_CABIN_VIEW)
        toggleCabinView();

    if (!isPortraitMode()) {
        showHotspots();
    } else {
        hideHotspots()
    }
}

const resetFov = () => {
    camera.fov = 0.8
}

const displaySubtitles = (category: FeatureCategory, feature: any) => {

    const subtitleContainer = document.getElementById("subtitle-container");
    const subtitleDescriptionElem = document.getElementById("subtitle-description");
    const subtitleHeadingElem = document.getElementById("subtitle-heading");

    if (subtitleDescriptionElem && subtitleHeadingElem) {
        subtitleContainer?.classList.remove("hidden")
        subtitleHeadingElem.innerHTML = `
        <span id = "mainheading"> ${category} | </span>
        <span id = "subheading">${feature.title}</span>`
        subtitleDescriptionElem.innerHTML = feature.content
    }
}

const displayTabContent = (category: FeatureCategory, index: number) => {
    const tabs = document.querySelectorAll("#tabs .tab");
    const tabContent = document.getElementById("tab-content") as HTMLDivElement;

    if (!tabs.length || !tabContent) return;

    // Remove active class from all tabs
    tabs.forEach(tab => tab.classList.remove("active"));

    // Add active class to selected tab
    tabs[index]?.classList.add("active");

    const feature = subFeatureTabsData[category][index];
    tabContent.innerHTML = `
        <h3>${feature.title}</h3>
        <p>${feature.content}</p>
    `;
    tabContent.style.display = "block";
}

export const stopAndStoreAllAnimationsOnLoad = (animationGroups: BABYLON.AnimationGroup[]) => {
    animationGroups.forEach((animationGroup) => {
        animationGroup.stop()
        ANIMATION_GROUPS.push(animationGroup)
    });
};

export const hideMeshes = (meshesToHide: string[]) => {
    meshesToHide.forEach(meshName => {
        let mesh = scene.getMeshByName(meshName);
        if (mesh)
            mesh.isVisible = false;
    });
}

const showAllMeshes = () => {
    scene.meshes.forEach(mesh => {
        if (!MESHES_TO_HIDE_ON_LOAD.includes(mesh.name)) { mesh.isVisible = true; }
        else {
            mesh.isVisible = false;
        }
    });
}

export const makeMeshVisible = (meshName: string) => {
    const mesh = scene.getMeshByName(meshName);
    if (!mesh)
        return
    mesh.isVisible = true
}

export const hideMeshesOnLoad = () => {
    MESHES_TO_HIDE_ON_LOAD.forEach(meshName => {
        const mesh = scene.getMeshByName(meshName);
        if (mesh)
            mesh.isVisible = false;
    });

}

export const changeVehicleColor = (color: VehicleColors) => {
    console.log("changeVehicleColor", color)
    const colorTextBox = document.getElementById("colorBoxName");
    const colorBtnElems = document.getElementsByClassName("colorBtn");
    const colorElem = document.getElementById(color);

    let BodyMaterial: any = scene.getMaterialByName("Body_Color_Base");
    let BodyMaterial1: any = scene.getMaterialByName("Chassis_Mat");

    if (!BodyMaterial && !BodyMaterial1) return;


    if(color === VehicleColors.NeptuneBlue) {
        applyTextureToMaterial("Stickers", ASSETS.OTHERS.blueColorTexture);
    } else if(color === VehicleColors.PristineWhite) {
        applyTextureToMaterial("Stickers", ASSETS.OTHERS.whiteColorTexture);
    }
 
    // Define start and end colors
    let startColor = (BodyMaterial || BodyMaterial1).albedoColor.clone(); // Use whichever exists
    let endColor = color === VehicleColors.PristineWhite
        ? BABYLON.Color3.FromHexString("#ebecea").toLinearSpace()  // White
        : BABYLON.Color3.FromHexString("#3172ad").toLinearSpace(); // Blue

    if (colorTextBox) colorTextBox.innerHTML = color;

    // Create a Babylon Animation for a smooth color transition
    const animation = new BABYLON.Animation(
        "colorTransition",
        "albedoColor",
        30, // FPS
        BABYLON.Animation.ANIMATIONTYPE_COLOR3,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    // Define animation keyframes
    const keyFrames = [
        { frame: 0, value: startColor },
        { frame: 5, value: endColor }
    ];
    animation.setKeys(keyFrames);

    // Apply animation to both materials (if they exist)
    [BodyMaterial, BodyMaterial1].forEach(material => {
        if (material) {
            material.animations = [];
            material.animations.push(animation.clone()); // Clone so each has its own animation instance
            scene.beginAnimation(material, 0, 5, false);
        }
    });

    // Update button active states
    for (let index = 0; index < colorBtnElems.length; index++) {
        colorBtnElems[index].classList.remove("active");
    }
    if (colorElem) colorElem.classList.add("active");
};



export const fullscreenToggle = (btn: HTMLElement) => {
    const icon = btn.querySelector("#fullscreen-icon") as HTMLImageElement;

    if (!document.fullscreenElement) {
        // Enter fullscreen
        document.documentElement.requestFullscreen().then(() => {
            icon.src = ASSETS.HEADERICONS.fullScreenExit; // Switch to exit icon
        }).catch(err => {
            // console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
        // Exit fullscreen
        document.exitFullscreen().then(() => {
            icon.src = ASSETS.HEADERICONS.fullScreen; // Switch back to fullscreen icon
        }).catch(err => {
            // console.error(`Error attempting to exit fullscreen: ${err.message}`);
        });
    }
};

export const togglePlayPause = () => {
    if (autoModeCooldown) return; // Prevent multiple rapid clicks

    autoModeCooldown = true; // Set cooldown flag
    setTimeout(() => {
        autoModeCooldown = false; // Reset cooldown after 1 second
    }, PLAY_PAUSE_TOGGLE_COOLDOWN);

    AUTO_MODE_PAUSED = !AUTO_MODE_PAUSED;

    if (!AUTO_MODE_PAUSED) {
        resumeAudio();
        resumeCameraRotation();
        resumeAnimations();
        resumeZoomIn();
        resumeProgressBar()
    } else {
        pauseAudio();
        pauseCameraRotation();
        pauseAnimations();
        pauseZoomIn();
        pauseProgressBar()
    }

    // 🔹 Dispatch a custom event when toggle is successful
    document.dispatchEvent(new CustomEvent("autoModeToggle", { detail: AUTO_MODE_PAUSED }));
};

export const toggleCabinView = () => {
    // INSIDE_CABIN_VIEW = !INSIDE_CABIN_VIEW;
    // const icon = btn.querySelector("#cabinView-icon") as HTMLImageElement;
    const icon = document.getElementById("cabinView-icon") as HTMLImageElement;
    if (!INSIDE_CABIN_VIEW) {
        enterCabinView();
        deselectSubcategoryItem();
        icon.src = ASSETS.HEADERICONS.cabinViewExit;
    } else {
        exitCabinView();
        icon.src = ASSETS.HEADERICONS.cabinView;
    }
}

const animateFOV = (targetFov: number) => {
    const fovAnim = new BABYLON.Animation(
        "fovAnimation",
        "fov",
        60, // frames per second
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    fovAnim.setKeys([
        { frame: 0, value: camera.fov },
        { frame: 90, value: targetFov }, // smooth transition
    ]);

    const easingFunction = new BABYLON.SineEase();
    easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
    fovAnim.setEasingFunction(easingFunction);

    camera.animations = camera.animations || [];
    camera.animations.push(fovAnim);

    return scene.beginAnimation(camera, 0, 90, false).waitAsync();
};

const enterCabinView = async () => {
    resetSceneState();
    INSIDE_CABIN_VIEW = true;
    hideHotspots();

    // Step 1: Rotate camera
    animateFOV(CABIN_VIEW_CAMERA_POINTS.fov);

    await rotateCamera({
        alpha: CABIN_VIEW_CAMERA_POINTS.alpha,
        beta: CABIN_VIEW_CAMERA_POINTS.beta,
        radius: CABIN_VIEW_CAMERA_POINTS.radius,
        target: {
            x: CABIN_VIEW_CAMERA_POINTS.x,
            y: CABIN_VIEW_CAMERA_POINTS.y,
            z: CABIN_VIEW_CAMERA_POINTS.z,
        }
    });


    // Step 2: Lock zoom after rotation
    if (INSIDE_CABIN_VIEW) {
        camera.lowerRadiusLimit = CABIN_VIEW_CAMERA_POINTS.radius - 1;
        camera.upperRadiusLimit = CABIN_VIEW_CAMERA_POINTS.radius + 1;
    }

    // Step 3: Subtle FOV change after rotation
};




const exitCabinView = () => {
    INSIDE_CABIN_VIEW = false;
    setCameraLimits();

    resetSceneState()
    setCameraToDeafultPosition()

    // setCameraLimits();
    // setCameraToDeafultPosition(
    //     () => {
    //         // showHotspots()
    //     }
    // );

}

export const storeVehicleMeshes = (meshes: BABYLON.AbstractMesh[]) => {
    VEHICLE_MESHES = meshes;
}

export const isMobileDevice = (): boolean => {
    // return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    const isSmallScreen = window.innerWidth <= 768;
    const isMobileUA = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent);
    return isSmallScreen || isMobileUA;
};


export const enableDebugMode = () => {
    scene.debugLayer.show()
    document.getElementById("sidebar-container")?.classList.add("hidden")
    document.getElementById("header-container")?.classList.add("hidden")
}

let shouldStop = false;
export const sleep = (ms: number): Promise<void> => {
    shouldStop = false;
    return new Promise((resolve, reject) => {
        if (shouldStop) reject(new Error("Execution stopped permanently"));
        setTimeout(() => {
            if (shouldStop) reject(new Error("Execution stopped permanently"));
            resolve();
        }, ms);
    });
};

export const rejectSleep = () => {
    shouldStop = true;
}

export const clipCameraValuesToLimits = (cameraValues: { alpha: number; beta: number; radius: number }) => {
    return {
        alpha: cameraValues.alpha, // Keep alpha unchanged
        beta: Math.min(CAMERA_DESKTOP_UPPER_BETA_LIMIT, Math.max(CAMERA_DESKTOP_LOWER_BETA_LIMIT, cameraValues.beta)),
        radius: Math.min(CAMERA_DESKTOP_UPPER_RADIUS_LIMIT, Math.max(CAMERA_DESKTOP_LOWER_RADIUS_LIMIT, cameraValues.radius)),
    };
};
/** Retrieves the mesh by name and logs a warning if not found.
 */
export const getMeshByName = (meshName: string) => {
    const mesh = scene.getMeshByName(meshName);
    if (!mesh) {
    }
    return mesh;
}

export const changeMaterialToAlphaBlend = (meshName: string, scene: BABYLON.Scene) => {
    const mesh = scene.getMeshByName(meshName);
    if (!mesh) {
        // console.error(`Mesh "${meshName}" not found`);
        return;
    }

    const material = mesh.material;
    if (!material) {
        // console.error(`No material found on mesh "${meshName}"`);
        return;
    }

    if (mesh.material)
        mesh.material.transparencyMode = BABYLON.Material.MATERIAL_ALPHABLEND;

};

export const isPortraitMode = (): boolean => {
    if (isMobileDevice())
        return window.screen.orientation.angle === 0 || window.screen.orientation.angle === 180
    else {
        return false;
    }
};

export const isDeviceRotated = () => {
    console.log("isDeviceRotated")
    window.addEventListener("orientationchange", () => {
        console.log("isDeviceRotated - orientation", isPortraitMode())
        setCameraLimits();
        setCameraToDeafultPosition();
        updateHeaderBrandLogoVisibility();
        if (isPortraitMode()) {
            switchBackToManualMode();
            deselectSubcategoryItem();
            deselectMainCategory();
            resetSceneState();
            hideHotspots();
        } else {
            showHotspots();
        }
    });
};


// export const redirectToHome = () => {
//     if (window.top)
//         window.top.location.href = "https://uat-www.tvsmotor.net/three-wheelers/king-ev-max";
//     else {
//         window.location.href = "https://uat-www.tvsmotor.net/three-wheelers/king-ev-max";
//     }


// };
const params = new URLSearchParams(window.location.search);
const baseUrl = params.get("baseurl");
const path = "/three-wheelers/king-ev-max";

export const redirectToHome = () => {
    if (baseUrl && window.top) {
        window.top.location.href = baseUrl + path;
    } else {
        console.warn("Base URL not found in query params");
    }
};



export const applyShaderToMesh = async (
    scene: BABYLON.Scene,
    meshName: string,
    shaderJsonPath: string
) => {
    try {
        // Find the mesh
        const mesh = scene.getMeshByName(meshName);
        if (!mesh) {
            // console.error(`Mesh with name "${meshName}" not found.`);
            return;
        }

        // Load shader JSON from local file
        const response = await fetch(shaderJsonPath);
        if (!response.ok) throw new Error(`Failed to load shader JSON: ${response.statusText}`);

        const shaderJson = await response.json();

        // Create Node Material
        const nodeMaterial = new BABYLON.NodeMaterial("nodeShader", scene);

        // ✅ Load shader data from JSON
        await nodeMaterial.loadFromSerialization(shaderJson);

        // ✅ Compile the material (Prevents rendering issues)
        nodeMaterial.build(false);

        // ✅ Apply Node Material to the mesh
        mesh.material = nodeMaterial;

    } catch (error) {
        //   console.error("Error loading Node Material:", error);
    }
};

export const setRenderingGroupId = (meshName: string) => {
    const mesh = scene.getMeshByName(meshName);
    if (!mesh)
        return;

    mesh.renderingGroupId = 1; // Ensure correct layer rendering
}

const getHeaderBrandLogo = () => document.getElementById("headerLogoImg");

export const hideHeaderBrandLogo = () => {
    getHeaderBrandLogo()?.classList.add('hidden');
};

export const showHeaderBrandLogo = () => {
    getHeaderBrandLogo()?.classList.remove('hidden');
};

export const updateHeaderBrandLogoVisibility = () => {
    console.log("updateHeaderBrandLogoVisibility", isPortraitMode(), isMobileDevice(), navigator.userAgent)
    if (isPortraitMode()) {
        showHeaderBrandLogo();
    } else {
        if (CURRENT_MODE === ModeType.AUTO) {
            showHeaderBrandLogo();
        } else {
            hideHeaderBrandLogo();
        }
    }
};

window.addEventListener('resize', () => {
    updateHeaderBrandLogoVisibility();
});


export function setEmissiveColorByMaterialName(materialName: string): void {
    const material = scene.getMaterialByName(materialName);

    if (!material) {
        console.warn(`Material "${materialName}" not found.`);
        return;
    }

    const gray = Color3.FromHexString("#000000FF");

    if ("emissiveColor" in material) {
        (material as StandardMaterial | PBRMaterial).emissiveColor = gray;
    } else {
        console.warn(`Material "${materialName}" does not support emissiveColor.`);
    }
}


let pipeline: DefaultRenderingPipeline | null = null;
let vignetteWeight = 0;
let targetWeight = 0;
let transitionSpeed = 0.05;

// export function applyVignettePipeline(): void {
//   pipeline = new DefaultRenderingPipeline(
//     "defaultPipeline",
//     true,
//     scene,
//     [scene.activeCamera!]
//   );

//   pipeline.imageProcessing.vignetteEnabled = true;

//   // Initial setup
//   pipeline.imageProcessing.vignetteStretch = 0.3;
// //   pipeline.imageProcessing.vignetteFov = 0.5;
//   pipeline.imageProcessing.vignetteCenterX = 0.0;
//   pipeline.imageProcessing.vignetteCenterY = 1.0;
//   pipeline.imageProcessing.vignetteColor = new Color4(0, 0, 0, 1);
//   pipeline.imageProcessing.vignetteBlendMode = 0;

//   // Start weight at 0 for initial transition
//   vignetteWeight = 0;
//   pipeline.imageProcessing.vignetteWeight = vignetteWeight;

//   // Animate transitions every frame
//   scene.onBeforeRenderObservable.add(() => {
//     if (!pipeline) return;

//     // Lerp vignette weight
//     if (Math.abs(vignetteWeight - targetWeight) > 0.01) {
//       vignetteWeight += (targetWeight - vignetteWeight) * transitionSpeed;
//       pipeline.imageProcessing.vignetteWeight = vignetteWeight;
//     } else {
//       pipeline.imageProcessing.vignetteWeight = targetWeight;
//     }
//   });
// }



// --- Vignette animation state ---
let currentVignetteWeight = 0;
let targetVignetteWeight = 0;
// const transitionSpeed = 0.05;

export const enableVignette = () => {
    targetVignetteWeight = 2;
};

export const disableVignette = () => {
    targetVignetteWeight = 0.0;
};

export const setupRenderingPipeline = (
    scene: Scene,
    camera: Camera,
    targetMeshes: string[]
) => {
    const engine = scene.getEngine();
    const caps = engine.getCaps();
    const maxSamples = caps.maxMSAASamples ?? 4;

    let fxaaEnabled = true;
    let msaaSamples = maxSamples >= 8 ? 8 : maxSamples >= 4 ? 4 : 2;

    const pipeline = new DefaultRenderingPipeline(
        "defaultPipeline",
        true, // Enable HDR
        scene,
        [camera]
    );

    // Apply dynamic settings
    pipeline.fxaaEnabled = fxaaEnabled;
    if (typeof IS_DEV_ENV !== "undefined" && !IS_DEV_ENV) {
        pipeline.samples = 1;
        engine.setHardwareScalingLevel(0.5);
    }

    // Tone mapping, contrast, etc.
    pipeline.imageProcessingEnabled = true;
    pipeline.imageProcessing.toneMappingEnabled = true;
    pipeline.imageProcessing.toneMappingType =
        BABYLON.ImageProcessingConfiguration.TONEMAPPING_ACES;
    pipeline.imageProcessing.exposure = 1;
    pipeline.imageProcessing.contrast = 1;

    // Vignette initial setup
    pipeline.imageProcessing.vignetteEnabled = true;
    pipeline.imageProcessing.vignetteStretch = 0.3;
    //   pipeline.imageProcessing.vignetteFov = 0.5;
    pipeline.imageProcessing.vignetteCenterX = 0.0;
    pipeline.imageProcessing.vignetteCenterY = 1.0;
    pipeline.imageProcessing.vignetteColor = new Color4(0, 0, 0, 1);
    pipeline.imageProcessing.vignetteBlendMode = 0; // Multiply
    pipeline.imageProcessing.vignetteWeight = currentVignetteWeight = 0;

    // Animate vignette transitions
    scene.onBeforeRenderObservable.add(() => {
        if (Math.abs(currentVignetteWeight - targetVignetteWeight) > 0.01) {
            currentVignetteWeight +=
                (targetVignetteWeight - currentVignetteWeight) * transitionSpeed;
            pipeline.imageProcessing.vignetteWeight = currentVignetteWeight;
        } else {
            pipeline.imageProcessing.vignetteWeight = targetVignetteWeight;
        }
    });

    // Optional glow
    const glowLayer = new GlowLayer("glow", scene);
    glowLayer.intensity = 0.8;

    return { pipeline, glowLayer };
};


export async function applyNodeMaterialToMesh(meshName: string, materialPath: string): Promise<void> {
    const mesh = scene.getMeshByName(meshName);

    if (!mesh) {
        console.warn(`Mesh with name "${meshName}" not found.`);
        return;
    }

    try {
        const nodeMaterial = await NodeMaterial.ParseFromFileAsync("iconMaterial", materialPath, scene);
        mesh.material = nodeMaterial;
    } catch (error) {
        console.error("Failed to load node material:", error);
    }
}


import * as BABYLON from "babylonjs";
import { resetModifiedMeshesRenderingGroupId } from "./helper/groupRenderingId";

interface TextureAnimationEntry {
    observer: BABYLON.Observer<BABYLON.Scene>;
    texture: BABYLON.Texture;
}

const activeTextureAnimations: TextureAnimationEntry[] = [];

export function animateMaterialTextureUOffset(
    materialName: string,
    speed: number = 0.01,
    targetOffset?: number, // New optional param
    textureSlot?: string,
) {
    const mat = scene.getMaterialByName(materialName) as BABYLON.Material | null;

    if (!mat) {
        console.warn(`Material '${materialName}' not found.`);
        return;
    }

    let tex: BABYLON.Texture | null = null;

    if (textureSlot) {
        const foundTex = (mat as any)[textureSlot];
        if (foundTex instanceof BABYLON.Texture) {
            tex = foundTex;
        }
    } else {
        const texSlots = [
            "diffuseTexture",
            "albedoTexture",
            "emissiveTexture",
            "ambientTexture",
            "opacityTexture",
            "bumpTexture",
            "metallicTexture",
            "roughnessTexture"
        ];

        for (const slot of texSlots) {
            const foundTex = (mat as any)[slot];
            if (foundTex instanceof BABYLON.Texture) {
                tex = foundTex;
                break;
            }
        }
    }

    if (!tex) {
        console.warn(
            textureSlot
                ? `Texture slot '${textureSlot}' not found or not a BABYLON.Texture in '${materialName}'.`
                : `No texture found in material '${materialName}'.`
        );
        return;
    }

    // Add animation to the scene loop and store observer + texture
    const observer = scene.onBeforeRenderObservable.add(() => {
        tex.uOffset += speed;

        // Wrap for endless animation if targetOffset not provided
        if (targetOffset === undefined) {
            if (tex.uOffset > 1) tex.uOffset -= 1;
            else if (tex.uOffset < 0) tex.uOffset += 1;
        } else {
            // Stop when we reach or pass the target
            if ((speed > 0 && tex.uOffset >= targetOffset) ||
                (speed < 0 && tex.uOffset <= targetOffset)) {
                tex.uOffset = targetOffset;
                scene.onBeforeRenderObservable.remove(observer);
                return;
            }
        }
    });

    activeTextureAnimations.push({ observer, texture: tex });
}


export function stopAllTextureAnimations() {
    activeTextureAnimations.forEach(({ observer, texture }) => {
        scene.onBeforeRenderObservable.remove(observer);
        if (texture && texture instanceof BABYLON.Texture) {
            texture.uOffset = 0; // Reset position
        }
    });
    activeTextureAnimations.length = 0; // Clear list
}



export function setEmissiveTextureFromPath(
    materialName: string,
    texturePath: string = ASSETS.OTHERS.emissiveTexture
) {
    const mat = scene.getMaterialByName(materialName) as BABYLON.Material | null;

    if (!mat) {
        console.warn(`Material '${materialName}' not found.`);
        return;
    }

    // Create texture
    const emissiveTex = new BABYLON.Texture(texturePath, scene);

    // Apply it
    (mat as any).emissiveTexture = emissiveTex;

    // Optional: make emissive stand out
    if ((mat as any).emissiveColor instanceof BABYLON.Color3) {
        (mat as any).emissiveColor = new BABYLON.Color3(1, 1, 1);
    }

    console.log(`Emissive texture applied to '${materialName}' from '${texturePath}'`);
}



export function applyTextureToMaterial(
    materialName: string,
    texturePath: string,
    textureSlot: string = "albedoTexture"
) {
    const mat = scene.getMaterialByName(materialName) as BABYLON.Material | null;

    if (!mat) {
        console.warn(`Material '${materialName}' not found.`);
        return;
    }

    const tex = new BABYLON.Texture(texturePath, scene);

    // Rotate texture 180 degrees (in radians)
    tex.uAng = Math.PI; // 180° rotation

    // Assign to specified slot if exists
    if ((mat as any)[textureSlot] !== undefined) {
        (mat as any)[textureSlot] = tex;

        // If this is an albedo texture, enable alpha support
        if (textureSlot === "albedoTexture") {
            tex.hasAlpha = true; // tell Babylon the texture contains alpha

            if ("useAlphaFromAlbedoTexture" in mat) {
                (mat as any).useAlphaFromAlbedoTexture = true;
            }
        }
    } else {
        console.warn(`Texture slot '${textureSlot}' not found on material '${materialName}'.`);
    }
}
