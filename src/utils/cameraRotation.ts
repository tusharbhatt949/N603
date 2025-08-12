import { Observer, Scene } from "babylonjs";
import {
  CAMERA_DEFAULT_ALPHA_VALUE,
  CAMERA_DEFAULT_BETA_VALUE,
  CAMERA_DEFAULT_DESKTOP_RADIUS_VALUE,
  CAMERA_DEFAULT_MOBILE_PORTRAIT_RADIUS_VALUE,
  CAMERA_DEFAULT_TARGET_POSITION_X,
  CAMERA_DEFAULT_TARGET_POSITION_Y,
  CAMERA_DEFAULT_TARGET_POSITION_Z,
  CAMERA_DESKTOP_LOWER_BETA_LIMIT,
  CAMERA_DESKTOP_LOWER_RADIUS_LIMIT,
  CAMERA_DESKTOP_UPPER_BETA_LIMIT,
  CAMERA_DESKTOP_UPPER_RADIUS_LIMIT,
  CAMERA_PORTRAIT_MOBILE_UPPER_RADIUS_LIMIT,
  CAMERA_RADIUS_WHEEL_PRECISION,
  IS_DEV_ENV,
} from "../constants/values";
import { createCopyCameraButton } from "../debug/camerabutton";
import { ArcRotateCameraWithSpin, camera } from "../main";
import { isPortraitMode, sleep } from "./utils";

let cameraAnimationGroup: BABYLON.AnimationGroup | null = null; // Store animation reference
let CAMERA_PAUSED = false;
let CAMERA_COMPLETED = false; // Track if camera has reached its target

interface CameraTarget {
  x: number;
  y: number;
  z: number;
}

interface RotateCameraParams {
  alpha?: number;
  beta?: number;
  radius?: number;
  target?: CameraTarget;
  resetToDefaultPositionFirst?: boolean;
  onAnimationEnd?: () => void; // ✅ Add this line

}

export const rotateCamera = async ({
  alpha = 0,
  beta = 0,
  radius = 2,
  target = {
    x: 0,
    y: 0,
    z: 0,
  },
  resetToDefaultPositionFirst = false,
}: RotateCameraParams): Promise<void> => {

  return new Promise<void>((resolve) => {

    // if(CURRENT_MODE == ModeType.MANUAL) {
    //   if(alpha < 0) {
    //     target.x -= 2
    //   } else {
    //     target.x += 2
    //   }
    // }
    const normalizedAlpha = normalizeAlpha(camera.alpha, alpha);

    const scene = camera.getScene();
    // const limitedRadius = 2;

    // Stop any existing animation before starting a new one
    if (cameraAnimationGroup) {
      cameraAnimationGroup.stop();
    }

    cameraAnimationGroup = new BABYLON.AnimationGroup("CameraAnimationGroup");
    CAMERA_COMPLETED = false; // Reset completion flag

    // Helper function to create animations with easing
    const createEasedAnimation = (
      property: string,
      from: number,
      to: number
    ) => {
      let animation = new BABYLON.Animation(
        `cameraAnimation_${property}`,
        property,
        60, // FPS
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
      );

      let easingFunction = new BABYLON.QuadraticEase();
      easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT); // Smooth in and out

      animation.setEasingFunction(easingFunction);

      animation.setKeys([
        { frame: 0, value: from },
        { frame: 100, value: to },
      ]);

      return animation;
    };

    // Animating alpha, beta, radius, and target separately with easing
    let alphaAnim = createEasedAnimation("alpha", camera.alpha, normalizedAlpha);
    let betaAnim = createEasedAnimation("beta", camera.beta, beta);
    let radiusAnim = createEasedAnimation("radius", camera.radius, radius);

    let targetXAnim = createEasedAnimation(
      "target.x",
      camera.target.x,
      target.x
    );
    let targetYAnim = createEasedAnimation(
      "target.y",
      camera.target.y,
      target.y
    );
    let targetZAnim = createEasedAnimation(
      "target.z",
      camera.target.z,
      target.z
    );

    // Attach animations to the camera
    cameraAnimationGroup.addTargetedAnimation(alphaAnim, camera);
    cameraAnimationGroup.addTargetedAnimation(betaAnim, camera);
    cameraAnimationGroup.addTargetedAnimation(radiusAnim, camera);
    cameraAnimationGroup.addTargetedAnimation(targetXAnim, camera);
    cameraAnimationGroup.addTargetedAnimation(targetYAnim, camera);
    cameraAnimationGroup.addTargetedAnimation(targetZAnim, camera);

    // Play the animation with easing
    cameraAnimationGroup.play(false); // False means it won't loop

    // Ensure the promise resolves when animation completes
    cameraAnimationGroup.onAnimationEndObservable.addOnce(() => {
      CAMERA_COMPLETED = true; // Mark animation as completed
      // camera.lowerRadiusLimit = limitedRadius;
      resolve();
    });
  });
};

export const initialLoadCamera = async (
  camera: ArcRotateCameraWithSpin,
  scene: BABYLON.Scene
) => {
  scene.environmentIntensity = 2;
  camera.fov = 0.8;
  // @ts-ignore
  camera.setPosition(new BABYLON.Vector3(0, 0, 0));
  // @ts-ignore
  // camera.setTarget(new BABYLON.Vector3(-0.061, 9.043, -0.41));
  camera.setTarget(new BABYLON.Vector3(-0.061, 9.043, -0.41));
  camera.alpha = 0;
  camera.beta = 1.6;
  camera.radius = 60;

  setCameraLimits();

  await rotateCamera({
    alpha: 0,
    beta: 1.6,
    radius: 25,
    target: {
      x: CAMERA_DEFAULT_TARGET_POSITION_X,
      y: CAMERA_DEFAULT_TARGET_POSITION_Y,
      z: CAMERA_DEFAULT_TARGET_POSITION_Z,
    },
    resetToDefaultPositionFirst: false,
  });
  setCameraToDeafultPosition();
  // camera.position.x -= 10; // Shift scene to the right by moving camera left
  if(IS_DEV_ENV)
  {createCopyCameraButton(camera)}

};

export const setCameraToDeafultPosition = async (callback?: () => void) => {
  let radius, y, beta;

  y = CAMERA_DEFAULT_TARGET_POSITION_Y;
  beta = CAMERA_DEFAULT_BETA_VALUE;

  radius = isPortraitMode()
    ? CAMERA_DEFAULT_MOBILE_PORTRAIT_RADIUS_VALUE
    : CAMERA_DEFAULT_DESKTOP_RADIUS_VALUE;

  await rotateCamera({
    alpha: CAMERA_DEFAULT_ALPHA_VALUE,
    beta: beta,
    radius: radius,
    target: {
      x: CAMERA_DEFAULT_TARGET_POSITION_X,
      y: y,
      z: CAMERA_DEFAULT_TARGET_POSITION_Z,
    },
    resetToDefaultPositionFirst: false,
  });

  if (callback) callback();

};

export const setCameraLimits = () => {
  camera.lowerRadiusLimit = CAMERA_DESKTOP_LOWER_RADIUS_LIMIT;
  camera.upperBetaLimit = CAMERA_DESKTOP_UPPER_BETA_LIMIT;
  camera.lowerBetaLimit = CAMERA_DESKTOP_LOWER_BETA_LIMIT;
  camera.wheelPrecision = CAMERA_RADIUS_WHEEL_PRECISION;
  camera.minZ = 0.1
  if (!IS_DEV_ENV)
    camera.panningSensibility = 0;

  if (isPortraitMode()) {
    camera.upperRadiusLimit = CAMERA_PORTRAIT_MOBILE_UPPER_RADIUS_LIMIT;
    // camera.upperBetaLimit = 1.55
  } else {
    camera.upperRadiusLimit = CAMERA_DESKTOP_UPPER_RADIUS_LIMIT;
  }
};

export const pauseCameraRotation = () => {
  if (cameraAnimationGroup) {
    cameraAnimationGroup.pause();
    CAMERA_PAUSED = true;
  }
};

// RESUME CAMERA ROTATION
export const resumeCameraRotation = () => {
  if (CAMERA_COMPLETED) {
    return; // Do nothing if animation already finished
  }

  if (CAMERA_PAUSED && cameraAnimationGroup) {
    cameraAnimationGroup.play(false); // Resume animation
    CAMERA_PAUSED = false;
  }
};


export const normalizeAlpha = (current: number, target: number): number => {
  let delta = (target - current) % (2 * Math.PI); // Normalize within -2π to 2π
  if (delta > Math.PI) delta -= 2 * Math.PI; // Adjust for shortest path
  if (delta < -Math.PI) delta += 2 * Math.PI;
  return current + delta; // Return adjusted target
};

// Normalize alpha before animating
// alpha = normalizeAlpha(camera.alpha, alpha);
export const applyInfiniteDollyZoom = (
  speed: number, // Speed of movement forward
  fovFactor: number // FOV increase factor
) => {
  if (!camera) return;

  const scene = camera.getScene();
  const direction = camera.getForwardRay().direction.normalize(); // Forward direction
  const initialFov = camera.fov;

  if (camera) {
    const initialRadius = camera.radius;

    scene.onBeforeRenderObservable.add(() => {
      const deltaTime = scene.getEngine().getDeltaTime() / 1000;
      if (camera.radius <= 15 || camera.fov >= 1) return; // Stop condition

      // Move the camera closer by decreasing radius
      camera.radius = Math.max(0.1, camera.radius - speed * deltaTime);

      // Increase FOV proportionally
      camera.fov = initialFov + (initialRadius - camera.radius) * fovFactor;

    });

  } else if (camera) {
    scene.onBeforeRenderObservable.add(() => {
      const deltaTime = scene.getEngine().getDeltaTime() / 1000;

      // Move camera forward in the direction it's facing
      camera.position.addInPlace(direction.scale(speed * deltaTime));

      // Increase FOV dynamically
      camera.fov = initialFov + camera.position.length() * fovFactor;
    });
  }
};


export const disableCameraControlsTemporarily = async (durationMs: number): Promise<void> => {
  return new Promise<void>((resolve) => {
    if (!camera) {
      resolve();
      return;
    }

    const canvas = camera.getScene().getEngine().getRenderingCanvas();
    if (!canvas) {
      resolve();
      return;
    }

    // Detach camera controls
    camera.detachControl();

    setTimeout(() => {
      console.log("Reattaching camera controls after", durationMs, "ms");
      // Reattach camera controls
      camera.attachControl(canvas, true);
      resolve();
    }, durationMs);
  });
};



let rotationObserver: Observer<Scene> | null = null;

export function startRotateCamera360(
  speed: number = 0.007 // default speed
) {
  const scene = camera.getScene();

  // Stop existing rotation before starting a new one
  stopRotateCamera360();

  rotationObserver = scene.onBeforeRenderObservable.add(() => {
    camera.alpha += speed;
    if (camera.alpha > Math.PI * 2) {
      camera.alpha -= Math.PI * 2;
    }
  });
}

export function stopRotateCamera360() {
  if (rotationObserver) {
    camera.getScene().onBeforeRenderObservable.remove(rotationObserver);
    rotationObserver = null;
  }
}

