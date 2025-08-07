import { HIGHLIGHT_COLOR } from "../constants/values";
import { highlightLayer, scene } from "../main";
import { VEHICLE_MESHES } from "./utils";

interface ActivePulses {
    [meshName: string]: boolean;
}

const activePulses: ActivePulses = {}; // Store active pulse animations


export const addHighlights = (meshName: string, bringToTop: boolean = true): void => {

    const mesh = scene.getMeshByName(meshName);
    if (!mesh || !(mesh instanceof BABYLON.Mesh)) {
        return;
    }

    // if (!mesh) return;

    if (activePulses[meshName]) return; // Prevent duplicate animations

    if (bringToTop) {
        // @ts-ignore
        mesh.renderingGroupId = 1; // Ensure correct layer rendering
    }

    // Ensure `hl` (highlight layer) is available
    if (!highlightLayer) {
        return;
    }

    // Add mesh to highlight layer with initial intensity 0 (invisible)
    highlightLayer.addMesh(mesh, BABYLON.Color3.FromHexString(HIGHLIGHT_COLOR));
    highlightLayer.blurHorizontalSize = 0; // Start at 0 to prevent flickering
    highlightLayer.blurVerticalSize = 0;
    highlightLayer.innerGlow = false

    let intensity = 0.0; // Start with zero intensity
    let increasing = true;
    let lastUpdate = performance.now();
    const frameInterval = 1000 / 24; // 24 FPS
    const easeFactor = 0.1; // Controls smoothness of the transition

    // **Glow Intensity Range**
    const minGlow = 0.5; // Minimum glow intensity
    const maxGlow = 1; // Maximum glow intensity

    let animationFrameId: number;

    function animatePulse() {
        if (!activePulses[meshName]) return; // Stop animation if removed

        const now = performance.now();
        const deltaTime = now - lastUpdate;

        if (deltaTime >= frameInterval) { // Limit to 24 FPS
            lastUpdate = now;

            if (increasing) {
                intensity = BABYLON.Scalar.Lerp(intensity, maxGlow, easeFactor);
                if (intensity >= maxGlow * 0.95) increasing = false;
            } else {
                intensity = BABYLON.Scalar.Lerp(intensity, minGlow, easeFactor);
                if (intensity <= minGlow * 1.05) increasing = true;
            }

            highlightLayer.blurHorizontalSize = intensity * 3;
            highlightLayer.blurVerticalSize = intensity * 3;
        }

        animationFrameId = requestAnimationFrame(animatePulse);
    }

    // **Start Animation with a slight delay**
    setTimeout(() => {
        activePulses[meshName] = true;
        animationFrameId = requestAnimationFrame(animatePulse);
    }, 50); // 50ms delay to prevent flickering

    // Store animation frame ID for potential stopping
    activePulses[meshName] = true;
};

export const stopAllHighlights = (): void => {
    Object.keys(activePulses).forEach((meshName) => {
        const mesh = scene.getMeshByName(meshName);
        if (!mesh || !(mesh instanceof BABYLON.Mesh)) {
            return;
        }

        // Ensure `hl` exists before removing
        if (highlightLayer) {
            highlightLayer.removeMesh(mesh); // Remove from highlight layer
        }

        // @ts-ignore
        mesh.renderingGroupId = 0; // Reset to default rendering group
    });

    // Clear all active pulse animations
    Object.keys(activePulses).forEach((meshName) => {
        delete activePulses[meshName];
    });

    resetHighlightOverlayAndOutline()
};

const originalMaterialProperties = new Map<
    string,
    { transparencyMode: number; alpha: number }
>();

// Function to store original transparency modes and alpha (Call this at scene initialization)
export const storeOriginalTransparencyModes = (): void => {
    VEHICLE_MESHES.forEach((mesh: BABYLON.AbstractMesh) => {
        if (mesh.material instanceof BABYLON.PBRMaterial) {
            if (!originalMaterialProperties.has(mesh.name)) {
                originalMaterialProperties.set(mesh.name, {
                    transparencyMode: mesh.material.transparencyMode ?? BABYLON.Material.MATERIAL_OPAQUE,
                    alpha: mesh.material.alpha ?? 1,
                });
            }
        }
    });
};

export const highlightMeshUsingTransparencyMode = (identifier: string): void => {
    VEHICLE_MESHES.forEach((mesh: BABYLON.AbstractMesh) => {
        if (mesh.material instanceof BABYLON.PBRMaterial) {
            const isTargetMesh = mesh.name === identifier || mesh.material.name === identifier;

            if (isTargetMesh) {
                // mesh.material.albedoColor = BABYLON.Color3.FromHexString("#00bfcd").toLinearSpace(); // Light blue highlight
            } else {
                mesh.material.transparencyMode = BABYLON.Material.MATERIAL_ALPHABLEND;
                mesh.material.alpha = 0.1; // Adjust transparency
            }
        }
    });
};

export const resetTransparencyMode = (): void => {
    VEHICLE_MESHES.forEach((mesh: BABYLON.AbstractMesh) => {
        if (mesh.material instanceof BABYLON.PBRMaterial) {
            // Restore the original transparency mode and alpha
            const originalProps = originalMaterialProperties.get(mesh.name);
            if (originalProps) {
                mesh.material.transparencyMode = originalProps.transparencyMode;
                mesh.material.alpha = originalProps.alpha;
            }

            mesh.visibility = 1; // Restore visibility

            if (mesh.material.name === "Body_blue_Big Body") {
                const BayDoorMaterial = scene.getMaterialByName("BayDoor") as BABYLON.PBRMaterial | null;
                const BodyMaterial = scene.getMaterialByName("Body_blue_Big Body") as BABYLON.PBRMaterial | null;

                if (BodyMaterial && BayDoorMaterial) {
                    BodyMaterial.albedoColor = BayDoorMaterial.albedoColor.clone();
                }
            }
        }
    });

    // Ensure Babylon.js recalculates material states
    scene.markAllMaterialsAsDirty(BABYLON.Material.AllDirtyFlag);
};

export const highlightMeshUsingOverlayAndAlpha = (
    materialsToTransparent: string[], 
    meshToHighlight: string
) => {
    // Lower the alpha for specified materials
    materialsToTransparent.forEach(materialName => {
        const material = scene.getMaterialByName(materialName) as BABYLON.StandardMaterial | null;
        if (material) {
            material.transparencyMode = BABYLON.Material.MATERIAL_ALPHABLEND;
            material.alpha = 0.2; // Adjust transparency as needed
        }
    });

    // Highlight the target mesh with outline and overlay
    const mesh = scene.getMeshByName(meshToHighlight);
    if (mesh) {
        // Enable overlay
        mesh.overlayColor = BABYLON.Color3.FromHexString(HIGHLIGHT_COLOR); // Overlay color
        mesh.overlayAlpha = 0.1; // Overlay transparency
        mesh.renderOverlay = true; // Enable overlay rendering

        // Enable outline
        mesh.outlineColor = BABYLON.Color3.FromHexString(HIGHLIGHT_COLOR); // Outline color
        mesh.outlineWidth = 0.001; // Adjust outline thickness
        mesh.renderOutline = true; // Enable outline rendering
    }
};

const resetHighlightOverlayAndOutline = () => {
    scene.meshes.forEach(mesh => {
        mesh.renderOverlay = false;
        mesh.renderOutline = false;
    });
};


