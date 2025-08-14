import * as BABYLON from "babylonjs";
import "babylonjs-loaders"; // Required for GLTF/GLB models
import "./styles/style.scss"; // Import CSS
import { ASSETS } from "./constants/assets";
import "./uiElements/loadingScreen/loadingScreen.css";
import "./uiElements/autoModeTimeline/autoModeTimeline.css";
// import "./uiElements/infographics/rangeText.css";
import "./styles/staticText.scss"
import { createUI } from "./uiElements/sidebar/sidebar";
import { createSubFeatureTabs } from "./uiElements/subFeatureTabs/subFeatureTabs";
import { applyNodeMaterialToMesh, applyShaderToMesh, changeMaterialToAlphaBlend, changeVehicleColor, enableDebugMode, hideMeshesOnLoad, isDeviceRotated, setEmissiveColorByMaterialName, setEmissiveTextureFromPath, setupRenderingPipeline, stopAndStoreAllAnimationsOnLoad, storeVehicleMeshes } from "./utils/utils";
import { createHeader } from "./uiElements/header/header";
import { createLoadingScreen, removeLoadingScreen, updateLoadingProgress } from "./uiElements/loadingScreen/loadingScreen";
import { initialLoadCamera } from "./utils/cameraRotation";
import { storeOriginalTransparencyModes } from "./utils/highlights";
import { createHotspots } from "./utils/hotspots";
import { CreateAutoModeTimeline } from "./uiElements/autoModeTimeline/autoModeTimeline";
import earcut from "earcut";
import { createRangeTextContainer } from "./uiElements/infographics/rangeText";
import { createFooterElements } from "./uiElements/footerElements/footerElements";
import { VehicleColors } from "./constants/enums";
import { IS_DEV_ENV, MESHES_WITH_GLOW_EFFECT } from "./constants/values";
import { animateSpeedLines } from "./utils/animations";
import { createChargingTextContainer } from "./uiElements/infographics/chargingText";
import { GlowLayer } from "@babylonjs/core";
import { createStaticTextContainer } from "./uiElements/infographics/staticText";
import { createExitButton } from "./uiElements/infographics/ExitButton";

// Attach Earcut to the global window object for Babylon.js
(window as any).earcut = earcut;
console.log("build version 18.3.2")

export interface ArcRotateCameraWithSpin extends BABYLON.ArcRotateCamera {
  cameraSpinRotation: (
    property: "alpha" | "beta" | "radius",
    targetValue: number,
    speed: number,
    radius: number,
    fov: number,
    onAnimationEnd?: () => void
  ) => void;
}
export let glowLayer: any = null;
export const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
const engine = new BABYLON.Engine(canvas, true);
export let highlightLayer: BABYLON.HighlightLayer;
export let camera: ArcRotateCameraWithSpin;

const createScene = (): BABYLON.Scene => {
  const scene = new BABYLON.Scene(engine);
  highlightLayer = new BABYLON.HighlightLayer("hl", scene)

  // Camera
  camera = new BABYLON.ArcRotateCamera(
    "camera",
    Math.PI / 2,
    Math.PI / 4,
    10,
    BABYLON.Vector3.Zero(),
    scene
  ) as ArcRotateCameraWithSpin;
  camera.attachControl(canvas, true);

  const hemilight = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);
  hemilight.intensity = 0.6

  const environment = scene.createDefaultEnvironment({
    environmentTexture: ASSETS.ENV.envfile,
    createSkybox: false,
    createGround: false,
  });

  const light = new BABYLON.DirectionalLight("light", new BABYLON.Vector3(-0.795, -0.348, -0.499), scene);
  light.position = new BABYLON.Vector3(10, 20, 10); // Adjust the light position
  light.intensity = 4; // Reduce light intensity if shadows are too light

  // Shadow generator
  const shadowGenerator = new BABYLON.ShadowGenerator(1024, light);

  shadowGenerator.useBlurExponentialShadowMap = true; // Enable blur for softer shadows
  shadowGenerator.blurKernel = 32; // Adjust blur intensity
  shadowGenerator.setDarkness(0); // Increase shadow darkness (0 = no shadow, 1 = fully dark)
  shadowGenerator.normalBias = -0.3200;
  // Ensure the environment texture is a CubeTexture before applying rotation
  if (scene.environmentTexture instanceof BABYLON.CubeTexture) {
    // scene.environmentTexture.rotationY = 5; // Rotate the environment texture
  }

  scene.environmentIntensity = 1; // Set intensity level



  loadMesh(scene, shadowGenerator);
  // @ts-ignore
  initialLoadCamera(camera, scene);

  return scene;
};

const loadMesh = (scene: BABYLON.Scene, shadowGenerator: BABYLON.ShadowGenerator) => {
  let loadedAssets = 0;
  const totalAssets = 2; // Update this if more assets are added

  const updateProgress = () => {
    loadedAssets++;
    const progress = Math.round((loadedAssets / totalAssets) * 100);
    updateLoadingProgress(progress);
    if (loadedAssets === totalAssets) {
      removeLoadingScreen();
    }
  };

  // BABYLON.SceneLoader.OnPluginActivatedObservable.add((plugin) => {
  //   if (plugin.name === "gltf") {
  //     (plugin as any).dracoCompression = {
  //       enabled: true, // Enable Draco decompression
  //     };
  //   }
  // });

  BABYLON.SceneLoader.ImportMesh(
    "",
    ASSETS.MESHES.vehicleEnvironment,
    "",
    scene,
    (meshes, _particleSystems, _skeletons, animationGroups) => {
      const floorMesh = meshes[0];
      floorMesh.scaling = new BABYLON.Vector3(0.70, 0.70, -0.70);
      floorMesh.position = new BABYLON.Vector3(16.557, -2.312, -0.78);

      const floor = scene.getMeshByName("Walls");

      animationGroups.forEach((animationGroup) => animationGroup.stop());
      // @ts-ignore
      stopAndStoreAllAnimationsOnLoad(animationGroups);
      hideMeshesOnLoad(); // Hide some meshes on load
      setEmissiveColorByMaterialName("ENV_Dome")
      setEmissiveTextureFromPath("Charging_Mat", ASSETS.OTHERS.chargingTexture)
      setEmissiveTextureFromPath("Sleek_Headlamp_Mat")
      setEmissiveTextureFromPath("Max_Speed_Mat")
      setEmissiveTextureFromPath("Plastic_Black_Glossy")
      setEmissiveTextureFromPath("Orange")
      setEmissiveTextureFromPath("Seat_Wireframe_Mat", ASSETS.OTHERS.emissiveTextureSeat)
      if (floor) floor.receiveShadows = true;

      updateProgress(); // Update loading screen progress
      /* meshes.forEach(mesh => {
        mesh.position.x += 100; // Shift all meshes to the right
      }); */
    }


  );

  BABYLON.SceneLoader.ImportMesh(
    "",
    ASSETS.MESHES.vehicle,
    "",
    scene,
    async (meshes, _particleSystems, _skeletons, animationGroups) => {
      meshes[0].scaling = new BABYLON.Vector3(0.78, 0.78, -0.78);
      meshes[0].position = new BABYLON.Vector3(16.557, -2.312, -0.78);

      const floorMesh = meshes[0] as BABYLON.Mesh; // Type assertion
      // floorMesh.scaling = new BABYLON.Vector3(70, 70, -70);
      const floor1 = scene.getMeshByName("ENV_Dome");
      const floor2 = scene.getMeshByName("Hill_Hold_Platform");
      if (floor1 && floor2) {
        floor1.receiveShadows = true; // Enable shadow receiving for the floor
        floor2.receiveShadows = true; // Enable shadow receiving for the floor
      }


      // @ts-ignore
      stopAndStoreAllAnimationsOnLoad(animationGroups);
      hideMeshesOnLoad(); // Hide some meshes on load
      updateProgress(); // Update loading screen progress
      // @ts-ignore
      storeVehicleMeshes(meshes);
      //@ts-ignore
      changeMaterialToAlphaBlend("Healight_Glow", scene);
      storeOriginalTransparencyModes();
      setupRenderingPipeline(scene, camera, MESHES_WITH_GLOW_EFFECT);
      // createHotspots();

      applyNodeMaterialToMesh("ICON_7_primitive4", ASSETS.OTHERS.iconMaterial)
      applyNodeMaterialToMesh("ICON_6_primitive3", ASSETS.OTHERS.iconMaterial)
      applyNodeMaterialToMesh("ICON_5_primitive3", ASSETS.OTHERS.iconMaterial)
      applyNodeMaterialToMesh("ICON_4_primitive3", ASSETS.OTHERS.iconMaterial)
      applyNodeMaterialToMesh("ICON_3_primitive3", ASSETS.OTHERS.iconMaterial)
      applyNodeMaterialToMesh("ICON_2_primitive3", ASSETS.OTHERS.iconMaterial)
      applyNodeMaterialToMesh("ICON_1_primitive4", ASSETS.OTHERS.iconMaterial);
      // applyNodeMaterialToMesh("TEXT_ECO", ASSETS.OTHERS.textMaterial);
      // applyNodeMaterialToMesh("Text_CITY", ASSETS.OTHERS.textMaterial);
      // applyNodeMaterialToMesh("Text_POWER", ASSETS.OTHERS.textMaterial);


      changeVehicleColor(VehicleColors.NeptuneBlue)
      // Load the texture
      // await animateSpeedLines();
      meshes.forEach(mesh => {
        shadowGenerator.addShadowCaster(mesh); // Make the vehicle cast shadows
        mesh.receiveShadows = true; // Optional: Make the vehicle receive shadows
      });

      const tvsauto = scene.getMaterialByName("Body_blue_Big Body") as BABYLON.StandardMaterial;
      if (tvsauto) {
        const ambientTex = new BABYLON.Texture(ASSETS.OTHERS.ao, scene);

        // Flip the texture vertically
        // ambientTex.vScale = -1;

        // Apply the ambient texture to the material
        tvsauto.ambientTexture = ambientTex;
      }

      //@ts-ignore
      applyShaderToMesh(scene, "Water", ASSETS.OTHERS.waterShader)
    }
  );
};

// const setupRenderingPipeline = (
//   scene: BABYLON.Scene,
//   camera: BABYLON.Camera,
//   targetMeshes: string[]
// ) => {
//   const engine = scene.getEngine();
//   const caps = engine.getCaps(); // Get system capabilities
//   const maxSamples = caps.maxMSAASamples ?? 4; // Max supported MSAA

//   // Dynamically determine the best settings
//   let fxaaEnabled = true;
//   let msaaSamples = maxSamples >= 8 ? 8 : maxSamples >= 4 ? 4 : 2;
//   let hardwareScaling = caps.highPrecisionShaderSupported ? 0.5 : 1.0;


//   // Enable Default Rendering Pipeline
//   const pipeline = new BABYLON.DefaultRenderingPipeline(
//     "defaultPipeline",
//     true, // Enable HDR
//     scene,
//     [camera]
//   );

//   // Apply dynamic settings
//   pipeline.fxaaEnabled = fxaaEnabled;
//   if (!IS_DEV_ENV) {
//     pipeline.samples = 1;
//     engine.setHardwareScalingLevel(0.5);
//   }


//   // Enable Image Processing & Set ACES Tone Mapping
//   pipeline.imageProcessingEnabled = true;
//   pipeline.imageProcessing.toneMappingEnabled = true;
//   pipeline.imageProcessing.toneMappingType = BABYLON.ImageProcessingConfiguration.TONEMAPPING_ACES;
//   pipeline.imageProcessing.exposure = 1;
//   pipeline.imageProcessing.contrast = 1;
//   // pipeline.sharpen.edgeAmount = 0.1;

//   // Create Glow Layer
//   //@ts-ignore
//   glowLayer = new GlowLayer("glow", scene);
//   glowLayer.intensity = 0.8;


//   return { pipeline, glowLayer };
// };

export const getScene = (): BABYLON.Scene => {
  return scene;
}
// export default createAndAnimateText;
createLoadingScreen()

// Create and render the scene
export const scene = createScene();
engine.runRenderLoop(() => scene.render());
// Resize event
window.addEventListener("resize", () => engine.resize());


document.body.appendChild(createUI());
document.body.appendChild(createSubFeatureTabs());
document.body.appendChild(createFooterElements());
document.body.appendChild(createHeader());
// document.body.appendChild(CreateAutoModeTimeline());
document.body.appendChild(createRangeTextContainer());
document.body.appendChild(createChargingTextContainer());
document.body.appendChild(createStaticTextContainer());
document.body.appendChild(createExitButton());
// document.body.appendChild(createSpeedTextContainer());

const autoModeTimelineContainer: HTMLElement | null = document.getElementById("autoModeTimeline-container");
// if(autoModeTimelineContainer)
autoModeTimelineContainer?.appendChild(CreateAutoModeTimeline())

const debugBtn = document.getElementById("debuglayer-btn") as HTMLElement;
debugBtn?.addEventListener("click", () => {
  enableDebugMode(); camera.attachControl(canvas, true),
    camera.panningSensibility = 60;

});

if (!IS_DEV_ENV) {
  // debugBtn.classList.add("hidden")
}
isDeviceRotated();

// const scale = window.devicePixelRatio;
// if (scale !== 1) {
//   document.body.style.zoom = (1 / scale).toString();
// }
