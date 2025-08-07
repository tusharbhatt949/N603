import { ASSETS } from "../../constants/assets";
import { VehicleColors } from "../../constants/enums";
import { changeVehicleColor } from "../../utils/utils";
import { ColorState, getCurrentColorState, setCurrentColor, subscribe } from "./colorState";

export function createColorsBox(): HTMLElement {
    const container = document.createElement("div");
    container.classList.add("colorBoxDiv");
    container.id = "colorBoxDiv";

    container.innerHTML =
        `<div class="colorBtnGroup" id="color-tabs">
        <button aria-label="Pristine White" class="hex colorBtn" id="${VehicleColors.PristineWhite}" data-item="Pristine White" style="background-color: #FFFFFF;">
                <div class="circle"></div>
                <img src="${ASSETS.SIDEBAR.colorSelectedWhite}" id="colorSelectedImg" style="visibility: hidden;" />
            </button>
            <button aria-label="Neptune Blue" class="hex colorBtn" id="${VehicleColors.NeptuneBlue}" data-item="Neptune Blue" style="background-color: #1C66EF;">
                <div class="circle"></div>
                <img src="${ASSETS.SIDEBAR.colorSelectedBlue}" id="colorSelectedImg" style="visibility: hidden;" />
            </button>
            
           
        </div>
        <div id="colorName-container">
            <p class="colorName" id="colorBoxName">${getCurrentColorState().currentColorName}</p>
        </div>`;

    const colorBtns = container.querySelectorAll(".colorBtn") as NodeListOf<HTMLButtonElement>;
    const colorName = container.querySelector("#colorBoxName") as HTMLParagraphElement;

    const updateUI = (state: ColorState) => {
        colorName.innerText = state.currentColorName;

        colorBtns.forEach((btn) => {
            btn.classList.remove("active");
            btn.style.border = 'none';

            const img = btn.querySelector("img") as HTMLImageElement;
            if (img) img.style.visibility = "hidden";

            if (btn.id === state.currentColor) {
                btn.classList.add("active");

                let borderColor = "white";
                if (btn.id === VehicleColors.PristineWhite) {
                    borderColor = "#1C66EF";
                }

                btn.style.border = `3px solid ${borderColor}`;

                // Make the image visible for selected color
                if (img) img.style.visibility = "visible";
            }
        });
    };

    // Set initial state
    updateUI(getCurrentColorState());

    // Subscribe to changes
    const unsubscribe = subscribe(updateUI);

    // Add event listeners
    colorBtns.forEach((colorBtn) => {
        colorBtn.addEventListener("click", () => {
            const color = colorBtn.id as VehicleColors;
            const name = colorBtn.dataset.item || "";
            setCurrentColor(color, name);
            // changeVehicleColor(color);
        });
    });

    // Cleanup on removal
    container.addEventListener('DOMNodeRemoved', () => {
        unsubscribe();
    });

    return container;
}
