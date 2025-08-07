import * as GUI from "babylonjs-gui";
import { scene } from "../main";
import { HIGHLIGHT_COLOR } from "../constants/values";
import { FeatureCategory } from "../constants/enums";
import { getMeshByName, isMobileDevice, isPortraitMode, renderTabs, selectTab } from "./utils";
import { scrollToCategory, scrollToSubcategoryItemByIndex } from "../uiElements/sidebar/sidebar";
// import { setActiveSidebarItem } from "../uiElements/sidebar/sidebar";

let hotspotControls: GUI.Control[] = []; // Store references to all hotspot UI elements

const HOTSPOT_MESHES = [
    { meshName: "Engine_low", targetFeature: FeatureCategory.Performance, subcategoryIndex: 0 },
    { meshName: "Seat", targetFeature: FeatureCategory.Comfort, subcategoryIndex: 0 },  
    { meshName: "Copper_Bezel_Front", targetFeature: FeatureCategory.Safety, subcategoryIndex: 1 },
    { meshName: "Charger_Box", targetFeature: FeatureCategory.Convenience, subcategoryIndex: 0 },
    { meshName: "Brake_Motor_primitive0", targetFeature: FeatureCategory.Safety, subcategoryIndex: 0 },
    { meshName: "Cluster", targetFeature: FeatureCategory.Technology, subcategoryIndex: 0 },
    { meshName: "door_left.001", targetFeature: FeatureCategory.Safety, subcategoryIndex: 3 },
];


const selectFeatureCategoryUsingHotspot = (
    category: FeatureCategory,
    subcategoryIndex: number = 0
  ) => {
    const categoryElement = document.querySelector(`.sidebar-item[data-category="${category}"]`);
    if (!categoryElement) return;
  
    // Remove previous active classes
    document.querySelectorAll(".sidebar-item").forEach(el => el.classList.remove("activeCategory"));
    document.querySelectorAll(".subcategory-list").forEach(list => list.classList.remove("activeSubcategory-list"));
    document.querySelectorAll(".subcategory-item").forEach(el => el.classList.remove("activeSubCategoryItem"));
    document.querySelectorAll(".subcategory-content").forEach(content => content.classList.remove("activeSubCategoryContent"));
  
    categoryElement.classList.add("activeCategory");
  
    const subcategoryList = document.querySelector(`.subcategory-list[data-category="${category}"]`);
    if (!subcategoryList) return;
  
    subcategoryList.classList.add("activeSubcategory-list");
  
    const subcategoryItems = subcategoryList.querySelectorAll(".subcategory-item");
    if (!subcategoryItems || subcategoryItems.length === 0) return;
  
    // Clamp index if it's out of range
    const index = Math.min(subcategoryIndex, subcategoryItems.length - 1);
    const subcategoryItem = subcategoryItems[index];
    if (!subcategoryItem) return;
  
    subcategoryItem.classList.add("activeSubCategoryItem");
  
    const subcategory = subcategoryItem.getAttribute("data-subcategory");
    if (!subcategory) return;
  
    const content = document.querySelector(`.subcategory-content[data-content="${subcategory}"]`);
    if (content) {
      content.classList.add("activeSubCategoryContent");
    }
  
    selectTab(category, index);
  };
  
  

/** Handles hotspot click event.
 */
function handleHotspotClick(targetFeature: FeatureCategory, meshName: string, subcategoryIndex = 0) {
    selectFeatureCategoryUsingHotspot(targetFeature, subcategoryIndex);
    scrollToCategory(targetFeature);
    scrollToSubcategoryItemByIndex(targetFeature, subcategoryIndex)
  }
  

/** Creates the UI elements for a hotspot.
 */
function createHotspotUI(hotSpotMesh: { meshName: string; targetFeature: FeatureCategory, subcategoryIndex : number }) {
    // Detect if the device is mobile
    
    const isMobile = window.innerWidth <= 768; // Adjust threshold if needed
    console.log("isMobile",isMobile,isMobileDevice(), navigator.userAgent)
    const scaleFactor = isMobile ? 0.7 : 1.2; // Half size on mobile

    // 🔲 Outer container (keeps everything aligned)
    const container = new GUI.StackPanel();
    container.width = `${30 * scaleFactor}px`;  
    container.height = `${30 * scaleFactor}px`;
    container.isVertical = false;
    container.color = "red";

    // 🔘 Circular Hotspot Button (Outer Border)
    const hotspot = GUI.Button.CreateImageOnlyButton(`hotspot_${hotSpotMesh.meshName}`, "");
    hotspot.width = `${30 * scaleFactor}px`;
    hotspot.height = `${30 * scaleFactor}px`;
    hotspot.background = "transparent";
    hotspot.cornerRadius = 15 * scaleFactor; // Fully circular
    hotspot.color = "#fff";
    hotspot.thickness = 3 * scaleFactor; // Scaled thickness

    // 🔴 Thicker Circular Border
    const border = new GUI.Rectangle();
    border.width = `${26 * scaleFactor}px`; 
    border.height = `${26 * scaleFactor}px`;
    border.color = "red"; 
    border.thickness = 4 * scaleFactor; 
    border.background = "transparent";
    border.cornerRadius = 13 * scaleFactor; 

    // 🔵 Circular Inner Box
    const innerBox = new GUI.Rectangle();
    innerBox.width = `${18 * scaleFactor}px`;
    innerBox.height = `${18 * scaleFactor}px`;
    innerBox.background = HIGHLIGHT_COLOR;
    innerBox.color = "transparent";
    innerBox.cornerRadius = 9 * scaleFactor; 

    // Add elements in hierarchy
    border.addControl(innerBox);
    container.addControl(border);
    hotspot.addControl(container);

    // Click handler
    hotspot.onPointerClickObservable.add(() => handleHotspotClick(hotSpotMesh.targetFeature, hotSpotMesh.meshName, hotSpotMesh.subcategoryIndex));

    return { border, innerBox, hotspot };
}




/** Main function to create hotspots.
 */

/** Function to hide all hotspots */
export function hideHotspots() {
    console.log("isDeviceRotated - hidehotspots")
    hotspotControls.forEach((control) => (control.isVisible = false));
}

/** Function to show all hotspots */
// export function showHotspots() {
//     console.log("isDeviceRotated - showHotspots")
//     hotspotControls.forEach((control) => (control.isVisible = true));
// }

/** Main function to create hotspots */
export function createHotspots() {
    if (!scene) {
        console.error("Scene is not initialized yet.");
        return;
    }

    const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);
    hotspotControls = []; // Reset the stored hotspots

    HOTSPOT_MESHES.forEach((hotSpotMesh) => {
        const mesh = getMeshByName(hotSpotMesh.meshName);
        if (!mesh) return;

        const { border, innerBox, hotspot } = createHotspotUI(hotSpotMesh);

        // Attach UI to mesh
        advancedTexture.addControl(border);
        advancedTexture.addControl(innerBox);
        advancedTexture.addControl(hotspot);

        border.linkWithMesh(mesh);
        innerBox.linkWithMesh(mesh);
        hotspot.linkWithMesh(mesh);

        // Store references to toggle visibility later
        hotspotControls.push(border, innerBox, hotspot);

        // Position adjustment
        border.top = innerBox.top = hotspot.top = -50;
    });

    if(isPortraitMode())
    {hideHotspots()}

}