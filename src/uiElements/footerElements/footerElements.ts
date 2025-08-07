import { ASSETS } from "../../constants/assets";
import { VehicleColors } from "../../constants/enums";
import { changeVehicleColor } from "../../utils/utils";
import { CreateAutoModeTimeline } from "../autoModeTimeline/autoModeTimeline";
import { createColorsBox } from "../colorsBox/colorsBox";

export function createFooterElements(): HTMLElement {
    const container = document.createElement("div");
    container.id = "footer-container";

    container.innerHTML = `

        <div id = "subtitle-container" class="">
            <p id="subtitle-heading">
                <span id = "mainheading">heading | </span>
                <span id = "subheading">subheading</span>
        </p>
            <p id="subtitle-description">desc</p>
        </div>

        <div id = "autoModeTimeline-container">
    
        </div>
        <div id = "colorBoxFooter-container">

        </div>
        <div id = "dummyDiv">

        </div>

        
    `

    // const colorBtns = container.querySelectorAll(".colorBtn") as NodeListOf<HTMLDivElement>;
    // colorBtns.forEach(colorBtn => {
    //     colorBtn.addEventListener("click",()=>{
    //         changeVehicleColor(colorBtn.id as VehicleColors)
    //     })
    // });
    const colorBoxFooter = container.querySelector("#colorBoxFooter-container") as HTMLElement;
    if (colorBoxFooter) {
        colorBoxFooter.appendChild(createColorsBox());
    }

    return container;
}
