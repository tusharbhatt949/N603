import { addHighlights, applyOutlineToMesh } from "../utils/highlights"
import { makeMeshVisible } from "../utils/utils"

export const doorOpenAnimation = [
    {
        name: "Door_Left_Action",
        sequence: 0,
        speed: 1,
        loop: false,
        startFrame: 0,
        endFrame: null,
        reverse: false
    },
]

export const wheelAnimation = [
    {
        name: "Tyre_Rear_Action",
        sequence: 0,
        speed: 6,
        loop: true,
        startFrame: 0,
        endFrame: null,
        reverse: false
    },
    {
        name: "Tyre_Front_Rotation_Action ",
        sequence: 0,
        speed: 6,
        loop: true,
        startFrame: 0,
        endFrame: null,
        reverse: false
    },
]

export const turnWithEaseAnimation = [
    {
        name: "Handle_Steering_Action",
        sequence: 0,
        speed: 1,
        loop: false,
        startFrame: 0,
        endFrame: null,
        reverse: false,
        onComplete:()=> {
            makeMeshVisible("Turning_Path")
        }
    },
]

export const highGroundClearingEaseAnimation = [
    {
        name: "Broken_Road_Action",
        sequence: 0,
        speed: 1,
        loop: false,
        startFrame: 0,
        endFrame: null,
        reverse: false
    },
    {
        name: "Ground_Clearance_Arrow_Action",
        sequence: 0,
        speed: 1,
        loop: false,
        startFrame: 0,
        endFrame: null,
        reverse: false
    },
    // {
    //     name: "Ground_Clearance_Text_Action",
    //     sequence: 0,
    //     speed: 1,
    //     loop: false,
    //     startFrame: 0,
    //     endFrame: null,
    //     reverse: false
    // },
    
]

export const GradeabilityAnimation = [
    {
        name: "Hill_Hold_Platform_Action",
        sequence: 0,
        speed: 1,
        loop: false,
        startFrame: 0,
        endFrame: null,
        reverse: false
    }, {
        name: "Hill_Hold_Animation_Action",
        sequence: 0,
        speed: 1,
        loop: false,
        startFrame: 0,
        endFrame: 92.9000,
        reverse: false
    },
    ...wheelAnimation
]

export const WaterWadingAnimation = [
    {
        name: "Water_Action",
        sequence: 0,
        speed: 1,
        loop: false,
        startFrame: 0,
        endFrame: null,
        reverse: false
    },
    {
        name: "Water_Tank_Glass_Action",
        sequence: 0,
        speed: 1,
        loop: false,
        startFrame: 0,
        endFrame: null,
        reverse: false
    },
    {
        name: "Water_Wading_Arrow_Action",
        sequence: 0,
        speed: 1,
        loop: false,
        startFrame: 0,
        endFrame: null,
        reverse: false
    },
    {
        name: "Water_Wading_Text_Action",
        sequence: 0,
        speed: 1,
        loop: false,
        startFrame: 0,
        endFrame: null,
        reverse: false
    },
    {
        name: "Rotation_Rear_Tyre_Action",
        sequence: 0,
        speed: 2,
        loop: true,
        startFrame: 0,
        endFrame: null,
        reverse: false
    },
    {
        name: "Rotation_Front_Tyre_Action",
        sequence: 0,
        speed: 2,
        loop: true,
        startFrame: 0,
        endFrame: null,
        reverse: false
    },
]

export const rollingWindowsAnimation = [
    {
        name: "Window_Left_Action",
        sequence: 0,
        speed: 0.8,
        loop: false,
        startFrame: 0,
        endFrame: null,
        reverse: false
    },
    {
        name: "Window_Right_Action",
        sequence: 0,
        speed: 0.8,
        loop: false,
        startFrame: 0,
        endFrame: null,
        reverse: false
    },
]

export const orvmAnimation = [
    {
        name: "Mirror_Axis_Left2_Action",
        sequence: 0,
        speed: 1,
        loop: false,
        startFrame: 0,
        endFrame: null,
        reverse: false
    },
    {
        name: "Mirror_Axis_Left1_Action",
        sequence: 0,
        speed: 0.8,
        loop: false,
        startFrame: 0,
        endFrame: null,
        reverse: false
    },
]

export const effortlessBrakingAnimation = [
    {
        name: "Drum_Brake_Arrow_Action",
        sequence: 0,
        speed: 1,
        loop: false,
        startFrame: 0,
        endFrame: null,
        reverse: false
    },

]
export const coverMoreBrakingAnimation = [
    {
        name: "Large_Tyre_Arrow_Action",
        sequence: 0,
        speed: 1,
        loop: false,
        startFrame: 0,
        endFrame: null,
        reverse: false
    },
]

export const wiperAnimation = [
    {
        name: "Windshield_Wiper_Action",
        sequence: 0,
        speed: 1,
        loop: true,
        startFrame: 0,
        endFrame: null,
        reverse: false
    },
    {
        name: "Wiper_Blade_Action",
        sequence: 1,
        speed: 1,
        loop: true,
        startFrame: 0,
        endFrame: null,
        reverse: false
    },
]

export const gloveBoxAnimation = [
    {
        name: "Glove_Box_Key_Lock_Action",
        sequence: 0,
        speed: 1,
        loop: false,
        startFrame: 0,
        endFrame: null,
        reverse: false
    },
    {
        name: "Glove_Box_Lid_Action",
        sequence: 1,
        speed: 1,
        loop: false,
        startFrame: 0,
        endFrame: null,
        reverse: false,
        onComplete: () => {
            addHighlights("Glove_Box");
            // applyOutlineToMesh("Glove_Box")
        }
    },
]

export const easyAccessAnimation = [
    {
        name: "Door_Left_Action",
        sequence: 0,
        speed: 1,
        loop: false,
        startFrame: 0,
        endFrame: null,
        reverse: false
    },
    {
        name: "Easy_Access_Arrow_1_Action",
        sequence: 1,
        speed: 1,
        loop: false,
        startFrame: 0,
        endFrame: null,
        reverse: false
    },
    {
        name: "Easy_Access_Arrow_2_Action",
        sequence: 1,
        speed: 1,
        loop: false,
        startFrame: 0,
        endFrame: null,
        reverse: false
    },
    // {
    //     name: "Glove_Box_Lid_Action",
    //     sequence: 1,
    //     speed: 1,
    //     loop: false,
    //     startFrame: 0,
    //     endFrame: null,
    //     reverse: false,
    // },
]

export const parkingBrakeAnimation = [
    {
        name: "Door_Left_Action",
        sequence: 0,
        speed: 1,
        loop: false,
        startFrame: 0,
        endFrame: null,
        reverse: false,
        onComplete: () => {
            addHighlights("Parking_Brake_Lever", true);
            applyOutlineToMesh("Parking_Brake_Lever", false, 500)
        }
    },
    {
        name: "Parking_Brake_Lever_Action",
        sequence: 1,
        speed: 0.7,
        loop: false,
        startFrame: 0,
        endFrame: null,
        reverse: false
    },
]


export const maxStabilityAnimation = [
    {
        name: "Max_Stability_Arrow_Action",
        sequence: 0,
        speed: 1,
        loop: false,
        startFrame: 0,
        endFrame: null,
        reverse: false,
        noOfIterations: 4,
        onIterationComplete: (iterationNo: number) => {
            if (iterationNo == 1) {
                makeMeshVisible("Load_1");
            }
            else if (iterationNo == 2) {
                makeMeshVisible("Load_2");
            }
            else if (iterationNo == 3) {
                makeMeshVisible("Load_3");
            }
        }
    },
]


export const futuristicTechAnimation = [
    {
        name: "ICON_1_Action",
        sequence: 0,
        speed: 0.8,
        loop: false,
        startFrame: 0,
        endFrame: null,
        reverse: false
    },
    {
        name: "ICON_2_Action",
        sequence: 0,
        speed: 0.8,
        loop: false,
        startFrame: 0,
        endFrame: null,
        reverse: false
    },

    {
        name: "ICON_3_Action",
        sequence: 0,
        speed: 0.8,
        loop: false,
        startFrame: 0,
        endFrame: null,
        reverse: false
    },
    {
        name: "ICON_4_Action",
        sequence: 0,
        speed: 0.8,
        loop: false,
        startFrame: 0,
        endFrame: null,
        reverse: false
    },
    {
        name: "ICON_5_Action",
        sequence: 0,
        speed: 0.8,
        loop: false,
        startFrame: 0,
        endFrame: null,
        reverse: false
    },
    {
        name: "ICON_6_Action",
        sequence: 0,
        speed: 0.8,
        loop: false,
        startFrame: 0,
        endFrame: null,
        reverse: false
    },
    {
        name: "ICON_7_Action",
        sequence: 0,
        speed: 0.8,
        loop: false,
        startFrame: 0,
        endFrame: null,
        reverse: false
    },
]