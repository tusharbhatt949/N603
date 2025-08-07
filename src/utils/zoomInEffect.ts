//@ts-nocheck
import { camera } from "../main";

let zoomPaused: boolean = false;
let zoomElapsedTime: number = 0;
let zoomStartTime: number = 0;
let zoomInitialPosition: BABYLON.Vector3;
let zoomTargetPosition: BABYLON.Vector3;
let zoomInAnimationActive: boolean = false;

export const zoomInSmooth = (duration: number = 9000, baseZoomStep: number = 1.5): void => {
    if (!camera || zoomInAnimationActive) return; // Prevent multiple zooms

    zoomInAnimationActive = true;
    zoomPaused = false;
    zoomElapsedTime = 0; // Reset elapsed time

// @ts-ignore
    const direction: BABYLON.Vector3 = camera.target.subtract(camera.position).normalize();
    const currentRadius: number = camera.position.subtract(camera.target).length();

    const customScaling = (radius: number): number => {
        if (radius >= 2 && radius <= 15) return 0.5;
        else if (radius < 2) return 1.0;
        else return 2.5;
    };

    const zoomStep: number = baseZoomStep * customScaling(currentRadius);
// @ts-ignore
    zoomTargetPosition = camera.position.add(direction.scale(zoomStep));

    zoomStartTime = performance.now();
// @ts-ignore
    zoomInitialPosition = camera.position.clone();

// @ts-ignore
    animateZoom(camera, duration); // Start animation
};

const animateZoom = (camera: BABYLON.ArcRotateCamera, duration: number): void => {
    if (!zoomInAnimationActive || zoomPaused) return; // Stop if paused or canceled

    const elapsedTime: number = performance.now() - zoomStartTime + zoomElapsedTime;
    const progress: number = Math.min(elapsedTime / duration, 1); // Clamp progress (0-1)

    camera.position = BABYLON.Vector3.Lerp(zoomInitialPosition, zoomTargetPosition, progress);

    if (progress < 1) {
        requestAnimationFrame(() => animateZoom(camera, duration));
    } else {
        zoomInAnimationActive = false;
    }
};

// **Pause Zoom Animation**
export const pauseZoomIn = (): void => {
    if (zoomInAnimationActive && !zoomPaused) {
        zoomPaused = true;
        zoomElapsedTime += performance.now() - zoomStartTime; // Store elapsed time
    }
};

// **Resume Zoom Animation**
export const resumeZoomIn = (duration: number = 9000): void => {
    if (zoomInAnimationActive && zoomPaused) {
        zoomPaused = false;
        zoomStartTime = performance.now(); // Reset start time
// @ts-ignore
        animateZoom(camera, duration); // Restart animation
    }
};

// **Stop Zoom Animation Completely**
export const stopZoomIn = (): void => {
    zoomInAnimationActive = false;
    zoomPaused = false;
};
