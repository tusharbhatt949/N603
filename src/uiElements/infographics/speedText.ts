// ✅ Function to create and return the text container
export function createSpeedTextContainer() {
    let textContainer = document.createElement("div");
    textContainer.id = "speedTextContainer";
    // textContainer.class = "speedTextContainer";
    textContainer.innerHTML = `
    <div id = "speedInfo-container">
        <p id="speedTextLabel">Speed</p>
        <div id="speedIncrementNumber-container">
            <p id="speedIncrementNumber">00</p>
            <p id="speedKmLabel">KM/h</p>
        </div>
    </div>`;

    // textContainer.classList.add("hidden")

    return textContainer;
}

// ✅ Function to start incrementing text from 0 to 60
export function startIncrementingSpeedText() {

    const textContainer = document.getElementById("speedTextContainer");

    textContainer?.classList.remove("hidden")

    const speedIncrementNumberElement = document.getElementById("speedIncrementNumber");
    if (!speedIncrementNumberElement) {
        // console.error("Text container not found!");
        return;
    }

    let numberValue = 0;
    let interval = setInterval(() => {
        if (numberValue > 60) {
            numberValue = 60
            let formattedNumber = numberValue < 10 ? `0${numberValue}` : numberValue.toString();
        
            speedIncrementNumberElement.innerHTML = formattedNumber;
            
            clearInterval(interval);
            return;
        }

        // Format the number correctly based on its value
        let formattedNumber = numberValue < 10 ? `0${numberValue}` : numberValue.toString();
        
        speedIncrementNumberElement.innerHTML = formattedNumber;
        
        numberValue++;
    }, 55);
}

export const hideSpeedInfographics = () => {
    const textContainer = document.getElementById("speedTextContainer");

    textContainer?.classList.add("hidden")
}

