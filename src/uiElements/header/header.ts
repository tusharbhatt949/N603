import { ASSETS } from "../../constants/assets";
import { ModeType, VehicleColors } from "../../constants/enums";
import { CURRENT_MODE, toggleMode } from "../../utils/autoManualMode";
import { fullscreenToggle, redirectToHome, toggleCabinView, togglePlayPause } from "../../utils/utils";
import { toggleMuteUnmute } from "../../utils/voiceovers";
import { createColorsBox } from "../colorsBox/colorsBox";

export function createHeader(): HTMLElement {
    const container = document.createElement("div");
    container.id = "header-container";

    container.innerHTML = `
        <div id="header">
            <div id="header-logo">
                <img src="${ASSETS.LOGO.tvsKingEvMaxLogo}" alt="tvskingevmaxlogo" id = "headerLogoImg">
                <div id="mobileRotateMessage-Container">
            <div id="rotateCamera-img">
                <img src="${ASSETS.OTHERS.rotateScreen}" alt="rotateScreen">
            </div>
            <div id= "rotateCamera-text">
                <p>
                Please rotate your device to landscape to have the full experience.
                </p>
            </div>
        </div>
            </div>
            
            <div id="header-buttons">
                <div id="header-buttons-row1">
                    
                    <div id="home-btn" class="header-btn">
                        <img id="home-icon" src="${ASSETS.HEADERICONS.home}" alt="homebutton">
                    </div>
                    <div id="volume-btn" class="header-btn">
                        <img id="volume-icon" src="${ASSETS.HEADERICONS.volumeOn}" alt="volumebutton">
                    </div>
                    <div id="cabinView-btn" class="header-btn">
                        <img id="cabinView-icon" src="${ASSETS.HEADERICONS.cabinView}" alt="cabinbutton">
                    </div>
                    <div id="playpause-btn" class="header-btn">
                        <img id="playpause-icon" src="${ASSETS.HEADERICONS.pause}" alt="playpausebutton">
                    </div>
                    <div id="autoManualBtn-container" class="header-btn-long">
                        <div id="auto-mode-switch-btn" class="mode-switch-btn">
                            <img src="${ASSETS.HEADERICONS.playAutoplay}">
                                Autoplay
                        </div>
                    </div>
                    <div id="fullscreen-btn" class="header-btn">
                        <img id="fullscreen-icon" src="${ASSETS.HEADERICONS.fullScreen}" alt="fullscreenbutton">
                    </div>

                </div>
                 <div id="header-buttons-row2">
                <!-- <div class="colorBoxDiv" id="colorBoxDiv">
                    <div class="colorBtnGroup " id="color-tabs">
                            <button class="hex colorBtn" id="${VehicleColors.PristineWhite}" data-item="PRISTINE WHITE" style="background-color: #FFFFFF;">
                            <div  class="circle" ></div>
                            </button>
                            <button class="hex colorBtn active" id="${VehicleColors.NeptuneBlue}" data-item="NEPTUNE BLUE"  style= "background-color: #3B80FF;">
                                <div  class="circle" ></div>
                            </button>
                    </div>

                    <div id = "colorName-container">
                        <p class="colorName" id="colorBoxName">Neptune Blue</p>
                    </div>
                </div> -->
                    
                </div>

                <!-- <div id="playPause-btn" class="hidden">
                    <img id="playPause-icon" src="${ASSETS.HEADERICONS.pause}">
                </div>
                
                
                 -->

            </div>
        </div>

    `;

    // Attach event listeners

    // const headerRow2 = container.querySelector("#header-buttons-row2") as HTMLElement;
    // if (headerRow2) {
    //     headerRow2.appendChild(createColorsBox());
    // }

    const homeBtn = container.querySelector("#home-btn") as HTMLElement;
    homeBtn?.addEventListener("click", () => redirectToHome());

    const headerLogo = container.querySelector("#header-logo") as HTMLElement;
    headerLogo?.addEventListener("click", () => redirectToHome());

    const cabinViewBtn = container.querySelector("#cabinView-btn") as HTMLElement;
    cabinViewBtn?.addEventListener("click", () => toggleCabinView());

    const fullscreenBtn = container.querySelector("#fullscreen-btn") as HTMLElement;
    fullscreenBtn?.addEventListener("click", () => fullscreenToggle(fullscreenBtn));

    const volumeBtn = container.querySelector("#volume-btn") as HTMLElement;
    volumeBtn?.addEventListener("click", () => toggleMuteUnmute());

    const autoModeBtn = container.querySelector("#auto-mode-switch-btn") as HTMLElement;
    const manualModeBtn = container.querySelector("#manual-mode-switch-btn") as HTMLElement;
    const playPauseBtn = container.querySelector("#playpause-btn") as HTMLElement;
    const playPauseIcon = container.querySelector("#playpause-icon") as HTMLImageElement;

    const modeSwitchBtn = container.querySelector("#auto-mode-switch-btn") as HTMLElement;
    // const playPauseBtn = document.getElementById("playPauseBtn"); // Ensure this exists
    // let isAutoMode = false; // Track mode state

    modeSwitchBtn?.addEventListener("click", () => {
        // isAutoMode = !isAutoMode; // Toggle state
        if (CURRENT_MODE != ModeType.AUTO) {
            toggleMode(ModeType.AUTO);
            // playPauseBtn.classList.remove("hidden"); // Show play/pause button
            modeSwitchBtn.innerHTML = `Manual`; // Update button
        } else {
            toggleMode(ModeType.MANUAL);
            // playPauseBtn.classList.add("hidden"); // Hide play/pause button
            modeSwitchBtn.innerHTML = `<img src="${ASSETS.HEADERICONS.playAutoplay}">Autoplay`;
            playPauseIcon.src = ASSETS.HEADERICONS.pause
        }
    });

    playPauseBtn?.addEventListener("click", () => {
        togglePlayPause();
    });

    // 🔹 Listen for the toggle event and update the icon when mode actually changes
    document.addEventListener("autoModeToggle", (event: Event) => {
        const isPaused = (event as CustomEvent<boolean>).detail;
        playPauseIcon.src = isPaused ? ASSETS.HEADERICONS.play : ASSETS.HEADERICONS.pause;
    });

    // const colorBtns = container.querySelectorAll(".colorBtn") as NodeListOf<HTMLDivElement>;
    // colorBtns.forEach(colorBtn => {
    //     colorBtn.addEventListener("click", () => {
    //         changeVehicleColor(colorBtn.id as VehicleColors)
    //     })
    // });

    return container;
}
