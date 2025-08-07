import { ASSETS } from "../../constants/assets";
import { FeatureCategory, ModeType } from "../../constants/enums";
import { subFeatureTabsData } from "../../constants/subFeatureTabsData";
import { CURRENT_MODE } from "../../utils/autoManualMode";
import { setCameraToDeafultPosition } from "../../utils/cameraRotation";
import { selectFeatureCategoryUsingHotspot } from "../../utils/hotspots";
import { resetSceneState, selectTab } from "../../utils/utils";
import { deselectMainCategory, deselectSubcategoryItem } from "../sidebar/sidebar";

let currentCategory: FeatureCategory | null = null;
let currentSubcategoryIndex: number | null = null;
let prevBtn: HTMLElement | null = null;
let nextBtn: HTMLElement | null = null;
let replayBtn: HTMLElement | null = null;
let startBtn: HTMLElement | null = null;

export function createExitButton() {
  const container = document.createElement("div");
  container.id = "bottom-btn-container";

  container.innerHTML = `
  <div id="playback-button-container">
    <div id="playback-buttons">
      <div id="prev-button">
        <img src="${ASSETS.OTHERS.nextIcon}" alt="Prev Icon" />
        <span class="playback-button-text">Prev</span>
      </div>
      <div id="exit-button">
        <img src="${ASSETS.OTHERS.exitIcon}" alt="Exit Icon" />
        <span class="playback-button-text">Exit</span>
      </div>
      <div id="replay-button">
        <img src="${ASSETS.OTHERS.replayIcon}" alt="Replay Icon" />
        <span class="playback-button-text">Replay</span>
      </div>
      <div id="next-button">
        <img src="${ASSETS.OTHERS.nextIcon}" alt="Next Icon" />
        <span class="playback-button-text">Next</span>
      </div>
    </div>
  </div>
  <div id="start-button-container">
    <div id="start-button">
        <img src="${ASSETS.OTHERS.startIcon}" alt="Exit Icon" />
        <span class="playback-button-text">Start</span>
      </div>
  </div>
  `;

  prevBtn = container.querySelector("#prev-button");
  nextBtn = container.querySelector("#next-button");
  replayBtn = container.querySelector("#replay-button");
  startBtn = container.querySelector("#start-button");

  container.querySelector("#exit-button")?.addEventListener("click", () => {
    resetSceneState();
    setCameraToDeafultPosition();
    deselectSubcategoryItem();
    deselectMainCategory();
  });

  prevBtn?.addEventListener("click", () => {
    navigateToPreviousFeature();
  });

  nextBtn?.addEventListener("click", () => {
    navigateToNextFeature();
  });

  replayBtn?.addEventListener("click", () => {
    replayCurrentFeature();
  });

  startBtn?.addEventListener("click", () => {
    handleFeaturesStart();
  });

  hideExitButton();
  return container;
}



export function hideExitButton() {
  const exitButton = document.getElementById("playback-button-container");
  const startButton = document.getElementById("start-button-container");
  if (exitButton && startButton) {
    exitButton.classList.add("hidden");
    startButton.classList.remove("hidden");
  }
   if(startButton && CURRENT_MODE === ModeType.AUTO) {
    startButton.classList.add("hidden");
  }
}

export function showExitButton() {
  const exitButton = document.getElementById("playback-button-container");
  const startButton = document.getElementById("start-button-container");

  if (exitButton && startButton && CURRENT_MODE === ModeType.MANUAL) {
    exitButton.classList.remove("hidden");
    startButton.classList.add("hidden");
  }
  if(startButton && CURRENT_MODE === ModeType.AUTO) {
    startButton.classList.add("hidden");
  }
}

export function showStartButton () {

}

export function setCurrentCategoryAndSubCategory(
  category: FeatureCategory,
  subcategoryIndex: number = 0
) {
  currentCategory = category;
  currentSubcategoryIndex = subcategoryIndex;
}

function navigateToNextFeature() {
  if (currentCategory && currentSubcategoryIndex !== null) {
    const categoryKeys = Object.keys(subFeatureTabsData) as FeatureCategory[];
    const currentCategoryData = subFeatureTabsData[currentCategory];

    if (!currentCategoryData) return;

    const isLastSubcategory = currentSubcategoryIndex >= currentCategoryData.length - 1;

    if (isLastSubcategory) {
      const currentCategoryIndex = categoryKeys.indexOf(currentCategory);

      // If there's a next category
      if (currentCategoryIndex < categoryKeys.length - 1) {
        const nextCategory = categoryKeys[currentCategoryIndex + 1];
        setCurrentCategoryAndSubCategory(nextCategory, 0); // Reset to first subcategory
        selectTab(nextCategory, 0);
        selectFeatureCategoryUsingHotspot(nextCategory, 0);
      }
      // else: already at the last subcategory of the last category — maybe handle it if needed
    } else {
      const nextSubIndex = currentSubcategoryIndex + 1;
      setCurrentCategoryAndSubCategory(currentCategory, nextSubIndex);
      selectTab(currentCategory, nextSubIndex);
      selectFeatureCategoryUsingHotspot(currentCategory, nextSubIndex);
    }
    updatePlaybackButtonState();
  }
}

function navigateToPreviousFeature() {
  if (currentCategory && currentSubcategoryIndex !== null) {
    const categoryKeys = Object.keys(subFeatureTabsData) as FeatureCategory[];
    const currentCategoryData = subFeatureTabsData[currentCategory];

    if (!currentCategoryData) return;

    const isFirstSubcategory = currentSubcategoryIndex <= 0;

    if (isFirstSubcategory) {
      const currentCategoryIndex = categoryKeys.indexOf(currentCategory);

      // If there's a previous category
      if (currentCategoryIndex > 0) {
        const prevCategory = categoryKeys[currentCategoryIndex - 1];
        const lastIndex = subFeatureTabsData[prevCategory].length - 1;
        setCurrentCategoryAndSubCategory(prevCategory, lastIndex);
        selectTab(prevCategory, lastIndex);
        selectFeatureCategoryUsingHotspot(prevCategory, lastIndex);
      }
    } else {
      const prevSubIndex = currentSubcategoryIndex - 1;
      setCurrentCategoryAndSubCategory(currentCategory, prevSubIndex);
      selectTab(currentCategory, prevSubIndex);
      selectFeatureCategoryUsingHotspot(currentCategory, prevSubIndex);
    }
    updatePlaybackButtonState();
  }
}

function replayCurrentFeature() {
  if (currentCategory && currentSubcategoryIndex !== null) {
    selectTab(currentCategory, currentSubcategoryIndex);
  }
}

function handleFeaturesStart() {
  selectTab(FeatureCategory.Performance, 0);
  setCurrentCategoryAndSubCategory(FeatureCategory.Performance, 0);
  selectFeatureCategoryUsingHotspot(FeatureCategory.Performance, 0);
}

export function updatePlaybackButtonState() {
  const categoryKeys = Object.keys(subFeatureTabsData) as FeatureCategory[];

  if (currentCategory === null || currentSubcategoryIndex === null) return;

  const currentCategoryIndex = categoryKeys.indexOf(currentCategory);
  const currentSubcategoryCount = subFeatureTabsData[currentCategory]?.length ?? 0;

  const isFirstCategory = currentCategoryIndex === 0 && currentSubcategoryIndex === 0;
  const isLastCategory =
    (currentCategoryIndex + 1) == categoryKeys.length - 1 &&
    currentSubcategoryIndex == currentSubcategoryCount - 1;

  console.log("islastCategory", isLastCategory, currentCategoryIndex, categoryKeys.length - 1, currentSubcategoryIndex == currentSubcategoryCount - 1);

  if (prevBtn) prevBtn.classList.toggle("disabled", isFirstCategory);
  if (nextBtn) nextBtn.classList.toggle("disabled", isLastCategory);
}

