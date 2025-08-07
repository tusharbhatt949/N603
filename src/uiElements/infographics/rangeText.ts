// ✅ Function to create and return the text container
export function createRangeTextContainer() {
    let textContainer = document.createElement("div");
    textContainer.id = "textContainer";
    // textContainer.class = "rangeTextContainer";
    textContainer.innerHTML = `
  <div id="rangeInfo-container">
    <p id="rangeTextLabel">Range</p>
    <div id="rangeIncrementNumber-container">
      <span id="rangeIncrementNumber">00</span>
      <span id="rangeKmLabel">Km/h</span>
    </div>
  </div>
`;


    textContainer.classList.add("hidden")

    return textContainer;
}

// ✅ Function to start incrementing text from 0 to 179
export function startIncrementingText() {

    const textContainer = document.getElementById("textContainer");
    textContainer?.classList.remove("hidden")

    const rangeIncrementNumberElement = document.getElementById("rangeIncrementNumber");
    if (!rangeIncrementNumberElement) {
        // console.error("Text container not found!");
        return;
    }

    let numberValue = 0;
    const targetRange = 156
    let interval = setInterval(() => {
        if (numberValue > targetRange) {
            numberValue = targetRange
            let formattedNumber = numberValue < 10 ? `0${numberValue}` : numberValue.toString();

            rangeIncrementNumberElement.innerHTML = formattedNumber;

            clearInterval(interval);
            return;
        }

        // Format the number correctly based on its value
        let formattedNumber = numberValue < 10 ? `0${numberValue}` : numberValue.toString();

        rangeIncrementNumberElement.innerHTML = formattedNumber;

        numberValue += 2;
    }, 55);
}

export const hideRangeInfographics = () => {
    const textContainer = document.getElementById("textContainer");

    textContainer?.classList.add("hidden")
}

