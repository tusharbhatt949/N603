//@ts-nocheck
import {
  MeshBuilder,
  StandardMaterial,
  Color3,
  ActionManager,
  ExecuteCodeAction,
  Mesh,
  Vector3,
  Scene,
  Texture,
  PointerEventTypes,
  PBRMaterial,
  NodeMaterial
} from "@babylonjs/core";
import { FeatureCategory, ModeType } from "../constants/enums";
import { camera, canvas, glowLayer, scene } from "../main";
import { getMeshByName, isMobileDevice, isPortraitMode, selectTab } from "./utils";
import { scrollToCategory, scrollToSubcategoryItemByIndex } from "../uiElements/sidebar/sidebar";
import { ASSETS } from "../constants/assets";
import { CURRENT_MODE } from "./autoManualMode";

let hotspotMeshes: Mesh[] = [];

const HOTSPOT_MESHES = [
  {
    meshName: "Engine_low",
    targetFeature: FeatureCategory.Performance,
    subcategoryIndex: 0,
    position: new Vector3(-9.091, 2.470, -0.411)
  },
  {
    meshName: "Seat",
    targetFeature: FeatureCategory.Comfort,
    subcategoryIndex: 0,
    position: new Vector3(1.745, 6.492, 0.382)
  },
  {
    meshName: "Copper_Bezel_Front",
    targetFeature: FeatureCategory.Safety,
    subcategoryIndex: 1,
    position: new Vector3(8.347, 5.828, 0.083)
  },
  {
    meshName: "Charger_Box",
    targetFeature: FeatureCategory.Convenience,
    subcategoryIndex: 0,
    position: new Vector3(-9.262, 8.140, 0.997)
  },
  {
    meshName: "Brake_Motor_primitive0",
    targetFeature: FeatureCategory.Safety,
    subcategoryIndex: 0,
    position: new Vector3(7.951, 1.993, -1.200)
  },
  {
    meshName: "Cluster",
    targetFeature: FeatureCategory.Technology,
    subcategoryIndex: 0,
    position: new Vector3(4.912, 8.534, 0.322)
  },
  {
    meshName: "door_left.001",
    targetFeature: FeatureCategory.Safety,
    subcategoryIndex: 3,
    position: new Vector3(-1.227, 5.051, 4.744)
  }
];

function handleHotspotClick(
  targetFeature: FeatureCategory,
  meshName: string,
  subcategoryIndex = 0
) {
  console.log("Hotspot clicked:", meshName);
  selectFeatureCategoryUsingHotspot(targetFeature, subcategoryIndex);
  scrollToCategory(targetFeature);
  scrollToSubcategoryItemByIndex(targetFeature, subcategoryIndex);
  hideHotspots();
}

export const selectFeatureCategoryUsingHotspot = (
  category: FeatureCategory,
  subcategoryIndex: number = 0
) => {
  const categoryElement = document.querySelector(`.sidebar-item[data-category="${category}"]`);
  if (!categoryElement) return;

  document.querySelectorAll(".sidebar-item").forEach(el => el.classList.remove("activeCategory"));
  document.querySelectorAll(".subcategory-list").forEach(list =>
    list.classList.remove("activeSubcategory-list")
  );
  document.querySelectorAll(".subcategory-item").forEach(el =>
    el.classList.remove("activeSubCategoryItem")
  );
  document.querySelectorAll(".subcategory-content").forEach(content =>
    content.classList.remove("activeSubCategoryContent")
  );

  categoryElement.classList.add("activeCategory");

  const subcategoryList = document.querySelector(`.subcategory-list[data-category="${category}"]`);
  if (!subcategoryList) return;

  subcategoryList.classList.add("activeSubcategory-list");

  const subcategoryItems = subcategoryList.querySelectorAll(".subcategory-item");
  if (!subcategoryItems || subcategoryItems.length === 0) return;

  const index = Math.min(subcategoryIndex, subcategoryItems.length - 1);
  const subcategoryItem = subcategoryItems[index];
  if (!subcategoryItem) return;

  subcategoryItem.classList.add("activeSubCategoryItem");

  const subcategory = subcategoryItem.getAttribute("data-subcategory");
  if (!subcategory) return;

  const content = document.querySelector(
    `.subcategory-content[data-content="${subcategory}"]`
  );
  if (content) {
    content.classList.add("activeSubCategoryContent");
  }

  selectTab(category, index);
};

export function hideHotspots() {
  console.log("hidehotspots")
  hotspotMeshes.forEach(mesh => (mesh.isVisible = false));
}

export function showHotspots() {

  if (!isPortraitMode() && CURRENT_MODE != ModeType.AUTO) {
    console.log("hide show hotspots")
    hotspotMeshes.forEach(mesh => (mesh.isVisible = true));
  } else {
    hideHotspots()
  }
}

export function createHotspots() {
  if (!scene) {
    console.error("Scene is not initialized yet.");
    return;
  }

  hotspotMeshes = [];

  HOTSPOT_MESHES.forEach(h => {
    const { meshName, position, targetFeature, subcategoryIndex } = h;

    // 📌 Create Plane
    const hotspot = MeshBuilder.CreatePlane(`hotspot_${meshName}`, {
      size: 0.7
      //@ts-ignore
    }, scene);

    hotspot.position = position;
    hotspot.billboardMode = Mesh.BILLBOARDMODE_ALL;
    hotspot.isPickable = true;

    NodeMaterial.ParseFromFileAsync(`hotspotMat_${meshName}`, ASSETS.OTHERS.hotspotMaterial, scene).then((nodeMat) => {
      nodeMat.backFaceCulling = false;
      nodeMat.disableLighting = true; // Optional, based on node material setup
      hotspot.material = nodeMat;
    }).catch(err => {
      console.error(`Failed to load hotspot node material for ${meshName}:`, err);
    });


    // ✨ Click interaction
    hotspot.actionManager = new ActionManager(scene);
    hotspot.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnPickTrigger, () => {
        handleHotspotClick(targetFeature, meshName, subcategoryIndex);
      })
    );

    if (glowLayer && typeof glowLayer.excludeMesh === "function") {
      glowLayer.excludeMesh(hotspot);
    } else {
      console.warn("glowLayer.excludeMesh is missing", glowLayer);
    }


    hotspotMeshes.push(hotspot);
  });

  // 🖱️ Cursor on hover
  scene.onPointerObservable.add((pointerInfo) => {
    if (pointerInfo.type === PointerEventTypes.POINTERMOVE) {
      const picked = pointerInfo.pickInfo?.pickedMesh;
      const canvas = scene.getEngine().getRenderingCanvas();
      if (canvas) {
        const isHotspot = picked && hotspotMeshes.includes(picked);
        canvas.style.cursor = isHotspot ? "pointer" : "default";
      }
    }
  });
  if (isPortraitMode()) {
      hideHotspots();
  }
}
