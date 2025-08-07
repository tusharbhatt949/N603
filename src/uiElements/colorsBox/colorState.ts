import { VehicleColors } from "../../constants/enums";
import { changeVehicleColor } from "../../utils/utils";

// colorState.ts
export type ColorState = {
    currentColor: VehicleColors;
    currentColorName: string;
  };
  
  const colorState: ColorState = {
    currentColor: VehicleColors.PristineWhite,
    currentColorName: "Pristine White"
  };
  
  const subscribers: Array<(state: ColorState) => void> = [];
  
  export function getCurrentColorState(): ColorState {
    return colorState;
  }
  
  export function setCurrentColor(color: VehicleColors, name: string) {
    colorState.currentColor = color;
    colorState.currentColorName = name;
    changeVehicleColor(color);
    subscribers.forEach(callback => callback(colorState));
  }
  
  export function subscribe(callback: (state: ColorState) => void) {
    subscribers.push(callback);
    return () => {
      const index = subscribers.indexOf(callback);
      if (index !== -1) subscribers.splice(index, 1);
    };
  }