export function createChargingTextContainer() {
    let textContainer = document.createElement("div");
    textContainer.id = "chargingTextContainer";
    // textContainer.class = "chargingTextContainer";
    textContainer.innerHTML = `
    <div id = "chargingInfo-container">
        <p id="chargingTextLabel">0%</p>
        <p id="chargingSubtitle">In 3hr 10min</p>
        <!-- <div id="chargingIncrementNumber-container">
            <p id="chargingIncrementNumber">00</p>
            <p id="chargingKmLabel">KMs</p>
        </div> -->
    </div>`;

    textContainer.classList.add("hidden")

    return textContainer;
}

export const hideChargingInfographics = () => {
    const textContainer = document.getElementById("chargingTextContainer");
    textContainer?.classList.add("hidden")
}

export const showChargingInfographics = () => {
    const textContainer = document.getElementById("chargingTextContainer");
    textContainer?.classList.remove("hidden")
    animateChargingPercentage()
}

export function animateChargingPercentage(
    targetPercent: number = 100,
    duration: number = 2500 // in milliseconds
) {
    const label = document.getElementById("chargingTextLabel");
    if (!label) return;

    label.textContent = "0%";
    let startTime: number | null = null;
    let lastDisplayedValue = -1;

    const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;

        const progress = timestamp - startTime;
        const progressRatio = Math.min(progress / duration, 1);
        let currentValue = Math.floor(progressRatio * targetPercent);

        // Round down to nearest multiple of 2
        currentValue = currentValue - (currentValue % 2);

        if (currentValue !== lastDisplayedValue) {
            label.textContent = `${currentValue}%`;
            lastDisplayedValue = currentValue;
        }

        if (progress < duration) {
            requestAnimationFrame(step);
        } else {
            label.textContent = `0-${targetPercent}%`; 
        }
    };

    requestAnimationFrame(step);
}


