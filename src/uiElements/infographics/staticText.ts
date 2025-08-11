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


// utils/numberAnimator.ts
const runningAnimations = new WeakMap<HTMLElement, number>();

function extractNumberParts(text: string) {
  const match = text.match(/-?\d+(\.\d+)?/);
  if (!match) return { value: null as number | null, prefix: text, suffix: "", decimals: 0 };

  const numStr = match[0];
  const idx = match.index!;
  const prefix = text.slice(0, idx);
  const suffix = text.slice(idx + numStr.length);
  const value = parseFloat(numStr);
  const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;

  return { value, prefix, suffix, decimals };
}

function cancelExistingAnimation(el: HTMLElement) {
  const prev = runningAnimations.get(el);
  if (prev !== undefined) {
    cancelAnimationFrame(prev);
    runningAnimations.delete(el);
  }
}

function animateNumberTextWithUnit(
  el: HTMLElement,
  end: number,
  prefix: string,
  suffix: string,
  decimals: number,
  duration = 1500
) {
  cancelExistingAnimation(el);

  const start = 0;
  // immediately show 0 (formatted)
  el.textContent = prefix + start.toFixed(decimals) + suffix;

  const startTime = performance.now();

  const step = (now: number) => {
    const t = Math.min((now - startTime) / duration, 1);
    // ease-out cubic
    const eased = 1 - Math.pow(1 - t, 3);
    const current = start + (end - start) * eased;
    el.textContent = prefix + current.toFixed(decimals) + suffix;

    if (t < 1) {
      const id = requestAnimationFrame(step);
      runningAnimations.set(el, id);
    } else {
      runningAnimations.delete(el);
    }
  };

  const id = requestAnimationFrame(step);
  runningAnimations.set(el, id);
}


export function updateStaticText(
  mainText: string,
  subText: string,
  topOffset = 20.5,
  layout: "row" | "column" = "row",
  animateNumber: boolean = false,
  duration: number = 800 // optional animation duration in ms
) {
  const rowContainer = document.getElementById("staticInfo-container-row");
  const columnContainer = document.getElementById("staticInfo-container-column");
  const textContainer = document.getElementById("staticTextContainer");

  if (!textContainer || !rowContainer || !columnContainer) return;

  textContainer.style.top = isMobileDevice() ? `${20.5}%` : `${topOffset}%`;

  if (layout === "row") {
    rowContainer.classList.remove("hidden");
    columnContainer.classList.add("hidden");

    const main = document.getElementById("mainStaticText");
    const sub = document.getElementById("subStaticText");

    if (main) {
      if (animateNumber) {
        const parts = extractNumberParts(mainText);
        if (parts.value !== null) {
          animateNumberTextWithUnit(
            main,
            parts.value,
            parts.prefix,
            parts.suffix,
            parts.decimals,
            duration
          );
        } else {
          main.textContent = mainText;
        }
      } else {
        main.textContent = mainText;
      }
    }

    if (sub) sub.textContent = subText;
  } else {
    columnContainer.classList.remove("hidden");
    rowContainer.classList.add("hidden");

    const label = document.getElementById("columnLabel");
    const value = document.getElementById("columnValue");

    if (label) label.textContent = mainText;
    if (value) {
      if (animateNumber) {
        const parts = extractNumberParts(subText);
        if (parts.value !== null) {
          animateNumberTextWithUnit(
            value,
            parts.value,
            parts.prefix,
            parts.suffix,
            parts.decimals,
            duration
          );
        } else {
          value.textContent = subText;
        }
      } else {
        value.textContent = subText;
      }
    }
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