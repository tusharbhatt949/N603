import { ASSETS } from "../../constants/assets";
import { ModeType } from "../../constants/enums";
import { toggleMode } from "../../utils/autoManualMode";

export function createLoadingScreen() {
    const loadingContainer = document.createElement("div");
    loadingContainer.id = "loading-container";
    loadingContainer.innerHTML = `
        <div id="loading-screen">
            <div id = "loading-logo">
                <img src="${ASSETS.LOGO.tvsKingEvMaxLogo}">
            </div>
            <div id="loading-bar-container">
                <div id="loading-bar"></div>
            </div>
        </div>
    `;

    document.body.appendChild(loadingContainer);
}

export function updateLoadingProgress(progress: number) {
    const loadingBar = document.getElementById("loading-bar");

    if (loadingBar) {
        loadingBar.style.width = `${progress}%`;
    }
}

export function removeLoadingScreen() {
    const loadingContainer = document.getElementById("loading-container");

    if (loadingContainer) {
        setTimeout(() => {
            toggleMode(ModeType.MANUAL);
            loadingContainer.remove();
            sendLoadingCompletedMessageToIframe()
        }, 1100); // Small delay for smooth disappearance
    }
}

function sendLoadingCompletedMessageToIframe() {
    window.parent.postMessage({ type: "LOADING_COMPLETED", data: "loading completed" }, "*");
}