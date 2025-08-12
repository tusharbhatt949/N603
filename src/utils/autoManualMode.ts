import { ASSETS } from "../constants/assets";
import { FeatureCategory, ModeType } from "../constants/enums";
import { subFeatureTabsData } from "../constants/subFeatureTabsData";
import { canvas, scene } from "../main";
import { resetProgressBars, startProgressBar } from "../uiElements/autoModeTimeline/autoModeTimeline";
import { deselectSubcategoryItem } from "../uiElements/sidebar/sidebar";
import { setCameraToDeafultPosition } from "./cameraRotation";
import { hideHotspots, showHotspots } from "./hotspots";
import { hideHeaderBrandLogo, isPortraitMode, resetSceneState, selectTab, showHeaderBrandLogo, sleep, updateHeaderBrandLogoVisibility } from "./utils";

export let CURRENT_MODE: ModeType | null = null;

export function toggleMode(modeType: ModeType): void {
    if (modeType === CURRENT_MODE) {
        return; // No need to switch if already in the selected mode
    }

    CURRENT_MODE = modeType;

    const elements = document.getElementsByClassName("mode-switch-btn");
    Array.from(elements).forEach(element => {
        element.classList.remove("selected-mode");
    });

    if (modeType === ModeType.AUTO) {
        const autoModeElement = document.getElementById("auto-mode-switch-btn");
        if (autoModeElement) {
            autoModeElement.classList.add("selected-mode");
        }
        runAutoMode();
    } else {
        const manualModeElement = document.getElementById("manual-mode-switch-btn");
        if (manualModeElement) {
            manualModeElement.classList.add("selected-mode");
        }
        const tabsContainer = document.getElementById("tabs-container");
        if (tabsContainer) {
            tabsContainer.style.display = "none";
        }
        runManualMode();
    }
    updateHeaderBrandLogoVisibility();
    updateUIForMode(modeType);
    resetSceneState();
}


const runManualMode = () => {
    if (scene.activeCamera)
        scene.activeCamera.attachControl(canvas); //disable camera interactions

    setCameraToDeafultPosition();
    deselectSubcategoryItem();
    if(isPortraitMode()) {
        hideHotspots()
    } else {
        showHotspots()
    }
}


const runAutoMode = () => {

    if (scene.activeCamera)
        scene.activeCamera.detachControl(canvas); //disable camera interactions

    async function clickNextMenuItem() {
        for (const category of Object.values(FeatureCategory)) {
            if(CURRENT_MODE!=ModeType.AUTO)
                break;
            await autoPlayTabs(category);
        }

        switchBackToManualMode()
    }

    clickNextMenuItem();
    hideHotspots();
}

export const switchBackToManualMode = () => {
    const modeSwitchBtn = document.getElementById("auto-mode-switch-btn") as HTMLElement;
    modeSwitchBtn.innerHTML = `<img src="${ASSETS.HEADERICONS.playAutoplay}">Autoplay`;
    toggleMode(ModeType.MANUAL); //switch back to manual mode when all features are done

}

const updateUIForMode = (modeType :ModeType) => {

    let elementsToRemove:string[] = [];
    let elementsToAdd:string[] = [];

    if(modeType == ModeType.AUTO) {
        elementsToRemove = ["colorBoxDiv","sidebar-container","subfeature-tabs-container","cabinView-btn"]
        elementsToAdd = ["playpause-btn","autoModeTimeline-container"];
    } else if(modeType ==ModeType.MANUAL) {
        elementsToRemove = ["playpause-btn", "subtitle-container","autoModeTimeline-container"]
        elementsToAdd = ["colorBoxDiv","sidebar-container","cabinView-btn"];
        resetProgressBars()
    }

    elementsToRemove.forEach(elementId => {
      const element = document.getElementById(elementId)
      if(element)
      element.classList.add("hidden");
    });

    elementsToAdd.forEach(elementId => {
      const element = document.getElementById(elementId)
      if(element)
      element.classList.remove("hidden");
    });
}

export const autoPlayTabs = async (category: FeatureCategory): Promise<void> => {
    const startTime = Date.now(); // Record the start time of the category

    //@ts-ignore
    const timeForCategoryInSecs =  subFeatureTabsData["AutoPlayTimes"][category]
    startProgressBar(category,timeForCategoryInSecs);

    for (let index = 0; index < subFeatureTabsData[category].length; index++) {
        if(CURRENT_MODE!=ModeType.AUTO)
            break;

        await selectTab(category, index, ModeType.AUTO);
        //@ts-ignore
        const isSleep = subFeatureTabsData[category][index].isSleepOnAutoMode
        if(isSleep) {
            await sleep(isSleep)
        }
        // IMPORTANT - get autoplay times for each cat from here
    }

    const endTime = Date.now(); // Record the end time of the category
    const timeTaken = (endTime - startTime) / 1000; // Convert to seconds

    console.log(`category autoplay tag ${category} took ${timeTaken} seconds`);
};
