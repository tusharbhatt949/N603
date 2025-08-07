import { isMobileDevice } from "../../utils/utils";

export function createStaticTextContainer() {
  const textContainer = document.createElement("div");
  textContainer.id = "staticTextContainer";

  textContainer.innerHTML = `
    <div id="staticInfo-container-row" class="static-layout-row">
        <p id="mainStaticText">60</p>
        <p id="subStaticText">KM/hr</p>
    </div>

    <div id="staticInfo-container-column" class="static-layout-column hidden">
        <p id="columnLabel">No roll-back for</p>
        <p id="columnValue">180 secs</p>
    </div>
  `;

  textContainer.classList.add("hidden");

  return textContainer;
}


export function updateStaticText(
  mainText: string,
  subText: string,
  topOffset = 20.5,
  layout: "row" | "column" = "row"
) {
  const rowContainer = document.getElementById("staticInfo-container-row");
  const columnContainer = document.getElementById("staticInfo-container-column");
  const textContainer = document.getElementById("staticTextContainer");

  if (!textContainer || !rowContainer || !columnContainer) return;

  textContainer.style.top = `${topOffset}%`;
  if (isMobileDevice() ){
    textContainer.style.top = `${20.5}%`;

  }

  if (layout === "row") {
    rowContainer.classList.remove("hidden");
    columnContainer.classList.add("hidden");

    const main = document.getElementById("mainStaticText");
    const sub = document.getElementById("subStaticText");

    if (main) main.textContent = mainText;
    if (sub) sub.textContent = subText;

  } else {
    columnContainer.classList.remove("hidden");
    rowContainer.classList.add("hidden");

    const label = document.getElementById("columnLabel");
    const value = document.getElementById("columnValue");

    if (label) label.textContent = mainText;
    if (value) value.textContent = subText;
  }
}


export function showStaticText(type = "default") {
  if (type === "default") {
    const textContainer = document.getElementById("staticTextContainer");
    if (textContainer) {
      textContainer.classList.remove("hidden");
    }
  }
}

export function hideStaticText() {
  const textContainer = document.getElementById("staticTextContainer");
  if (textContainer) {
    textContainer.classList.add("hidden");
  }
}