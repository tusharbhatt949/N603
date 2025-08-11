import { showChargingInfographics } from "../uiElements/infographics/chargingText";
import { startIncrementingText } from "../uiElements/infographics/rangeText";
import { showStaticText, updateStaticText } from "../uiElements/infographics/staticText";
import { blinkAnimation, makeSceneDarkAnimation, prepareAndPlayAnimations, shineAnimation, slowAndStopAnimation, startSpeedLines, stopSpeedLines } from "../utils/animations";
import { startRotateCamera360 } from "../utils/cameraRotation";
import { addHighlights, applyOutlineToMesh, highlightMeshUsingOverlayAndAlpha, highlightMeshUsingTransparencyMode } from "../utils/highlights";
import { makeMeshVisible, setRenderingGroupId, sleep } from "../utils/utils";
import { GradeabilityAnimation, WaterWadingAnimation } from "./animationData";
import { FeatureCategory } from "./enums";
import { CAMERA_DEFAULT_TARGET_POSITION_X, CAMERA_DEFAULT_TARGET_POSITION_Y, CAMERA_DEFAULT_TARGET_POSITION_Z, CAMERA_DEFAULT_ALPHA_VALUE, CAMERA_DEFAULT_BETA_VALUE, CAMERA_DEFAULT_DESKTOP_RADIUS_VALUE, HIGHLIGHT_COLOR } from "./values";

export const subFeatureTabsData = {
    [FeatureCategory.Performance]: [
        {
            title: "Max pick up", content: "Class-leading 0-30 pickup in 5.9 seconds, even with load.",
            camera: {
                alpha: 0.8370, beta: 1.0395, radius: 22.2872, x: -0.723, y: 7.612, z: 0.695
            },
            highlightMesh: () => {
                // addHighlights("Engine_N603", true)
                updateStaticText("Pickup in 5.9 secs", "0-30 KM/Hr", 12, "column");
                showStaticText();
                applyOutlineToMesh("Engine_N603")
            },
            isRoadAnim: true,
            animations: [
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
            ],
        },
        {
            title: "Max speed", content: "Top speed of 60 km/h ensure faster deliveries, more profit.",
            camera: {
                alpha: 1.4597, beta: 1.5923, radius: 40.9816, x: -0.010, y: 8.711, z: -0.026
            },
            highlightMesh: () => {
                updateStaticText("Max Speed", "60 Km/h", 12, "column", true);
                showStaticText();
            },
            animations: [

            ]
        },
        {
            title: "Always be ready", content: "Fastest Charging Time 0-100% in just 3 hours 10 minutes.",
            camera: {
                alpha: 1.0783, beta: 1.2186, radius: 34.7685, x: -1.084, y: 7.718, z: 0.535
            },
            highlightMesh: () => {
                // addHighlights("Battery_Pack_N603_primitive0")
                applyOutlineToMesh("Battery_Pack_N603_primitive0")
                showChargingInfographics();
            },
            animations: [
                {
                    name: "Rotation_Charging_Lid_Action",
                    sequence: 0,
                    speed: 1,
                    loop: false,
                    startFrame: 0,
                    endFrame: null,
                    reverse: false,
                    onComplete: () => addHighlights("Battery_Charging_Port", false)
                },
            ]
        },
        {
            title: "Go Far", content: "Travel longer with 156 km (GVW) real-world range.",
            camera: {
                alpha: 1.4597, beta: 1.5923, radius: 40.9816, x: -0.010, y: 8.711, z: -0.026
            },
            resetToDefaultPositionFirst: true,
            isRoadAnim: true,
            showMesh: ["Milestone"],
            highlightMesh: () => {
                // startSpeedLines()
                startIncrementingText()
                // animateUScaleToZero("Env_Dome")
            },
            animations: [
                {
                    name: "Rotation_Rear_Tyre_Action",
                    sequence: 0,
                    speed: 6,
                    loop: true,
                    startFrame: 0,
                    endFrame: null,
                    reverse: false
                },
                {
                    name: "Rotation_Front_Tyre_Action",
                    sequence: 0,
                    speed: 6,
                    loop: true,
                    startFrame: 0,
                    endFrame: null,
                    reverse: false
                },
                {
                    name: "Milestone_Action",
                    sequence: 0,
                    speed: 1.5,
                    loop: false,
                    startFrame: 0,
                    endFrame: null,
                    reverse: false,
                    noOfIterations: 4,
                    iterationEndFrame: 58,
                    // showMesh:["179_Text","KMS_Text"],
                    onIterationComplete: (iterationNo: number) => {
                        if (iterationNo == 4) {
                            slowAndStopAnimation(["Rotation_Rear_Tyre_Action", "Rotation_Front_Tyre_Action", "roadAnim"]);
                            makeMeshVisible("179_Text");
                            makeMeshVisible("KMS_Text");
                        }
                    }
                },
            ]
        },
        {
            title: "Carry More", content: "187 Cubic Feet of Volumetric Capacity. Carry more per trip.",
            camera: {
                alpha: 0.6742, beta: 1.2796, radius: 46.0186, x: 0.000, y: 7.500, z: 0.000
            },

            highlightMesh: () => {
                // startIncrementingText()
            },
            animations: [
            ]
        },
        {
            title: "Climb Confidently", content: "Gradeability of 28.7 %. Drive on slopes with confidence.",
            camera: {
                alpha: 1.5, beta: 1.5, radius: 44, x: 2, y: 7.5, z: 0
            },
            highlightMesh: () => {
                updateStaticText("Gradeability", "28.7%", 12, "column", true);
                showStaticText();
            },
            animations: GradeabilityAnimation
        },
        {
            title: "High Ground Clearance", content: "Ground Clearance of 235 mm with the lowest loading height of 703 mm.",
            camera: {
                alpha: 1.4597, beta: 1.5923, radius: 40.9816, x: -0.010, y: 8.711, z: -0.026
            },
            highlightMesh: () => {
                updateStaticText("High Ground Clearance", "235 mm", 12, "column", true);
                showStaticText();
            },
            animations: [
            ]
        },
        {
            title: "Peace of Mind", content: "Worry-free drives with 6yr/1.5 lakh km warranty.",
            camera: {
                alpha: 1.4597, beta: 1.5923, radius: 40.9816, x: -0.010, y: 8.711, z: -0.026
            },

            highlightMesh: () => {
                updateStaticText("Warranty", "6yr/1.5 Lakh KMs", 12, "column");
                showStaticText();
                startRotateCamera360();
                // startIncrementingText()
            },
            zoomEffect:false,
            animations: [
            ]
        },
    ],
    [FeatureCategory.Comfort]: [
        {
            title: "Fully Rolling Windows", content: "Segment first Full-Size Rolling Windows for improved ventilation.",
            camera: {
                alpha: 1.5684, beta: 1.5185, radius: 26.0366, x: 4.866, y: 9.717, z: -0.470
            },
            highlightMesh: () => {
                addHighlights("Window_L_primitive1", false);
                // applyOutlineToMesh("Window_L_primitive1", false, 0.2)
            },
            animations: [
            ]
        },
        {
            title: "Roof Trim Provision", content: "Segment-First Roof Trim reduces cabin temperature by up to 6°C.",
            camera: {
                alpha: 1.9459, beta: 1.6500, radius: 8.5564, x: 5.298, y: 10.156, z: 2.326
            },
            highlightMesh: () => {
                // addHighlights("Roof_Cloth", false) 
            },
            animations: [
            ]
        },
        {
            title: "Bump-Free Drive", content: "Dual-rate suspension ensure smooth rides on rough terrain.",
            camera: {
                alpha: -0.9133, beta: 1.4895, radius: 17.2698, x: 4.788, y: 1.932, z: 5.435
            },
            highlightMesh: () => {

            },
        },
        {
            title: "Relaxed Drive", content: "Wide-backed ergonomic seat offers superior driving comfort.",
            camera: {
                alpha: -5.8645, beta: 1.0734, radius: 13.5185, x: 1.369, y: 7.140, z: -1.733
            },
            highlightMesh: () => {
                addHighlights("Seat_primitive0", true);
                addHighlights("Seat_Backrest_primitive0", true);

                applyOutlineToMesh("Seat_primitive0")
                applyOutlineToMesh("Seat_Backrest_primitive0")
            },
            hideMesh: ["Windshield"],
            animations: [

            ]
        },
        // {
        //     title: "Drive Modes", content: "This allows the driver to choose from Eco, City, and Power modes.",
        //     camera: {
        //         alpha: -3.0606, beta: 1.3739, radius: 4.6, x: 5.534, y: 8.198, z: 0.395
        //     },
        //     highlightMesh: () => addHighlights("Drive_Mode_Buttons", false),
        //     resetToDefaultPositionFirst: true,
        //     animations: [
        //         {
        //             name: "TEXT_ECO_Action",
        //             sequence: 0,
        //             speed: 2,
        //             loop: false,
        //             startFrame: 0,
        //             endFrame: 50,
        //             reverse: false
        //         },
        //         {
        //             name: "Text_CITY_Action",
        //             sequence: 1,
        //             speed: 2,
        //             loop: false,
        //             startFrame: 0,
        //             endFrame: 50,
        //             reverse: false
        //         },
        //         {
        //             name: "Text_POWER_Action",
        //             sequence: 2,
        //             speed: 2,
        //             loop: false,
        //             startFrame: 0,
        //             endFrame: 50,
        //             reverse: false
        //         },
        //     ]
        //     // zoomEffect : false
        // }
    ],
    [FeatureCategory.Design]: [
        {
            title: "Sleek Headlamp mask", content: "With 3D Stallion logo featuring sleek, premium-fit textures.",
            camera: {
                alpha: -0.0180, beta: 1.5391, radius: 25.9992, x: -0.030, y: 7.524, z: -0.900
            },
            // resetToDefaultPositionFirst : true,
            highlightMesh: () => shineAnimation("Glossy_Copper", 0, -1, 120, HIGHLIGHT_COLOR),
        },
        {
            title: "Large Windshield", content: "Large bonded windshield ensures clear visibility & safety.",
            camera: {
                alpha: 3.1631, beta: 1.4966, radius: 8.5387, x: 8.470, y: 11.193, z: -0.592
            },
            highlightMesh: () => addHighlights("Front_Fender", false),
        },
        {
            title: "Upscale Cabin", content: "Spacious Cabin with inner door trim & plush interiors.",
            camera: {
                alpha: 9.4427, beta: 1.1979, radius: 4.7515, x: 6.213, y: 9.909, z: -0.681, fov: 1.2135
            },
            highlightMesh: () => addHighlights("Front_Fender", false),
        },
        {
            title: "Elegant Dashboard", content: "Piano black bezel design for a premium in-cabin experience.",
            camera: {
                alpha: 3.1720, beta: 0.8943, radius: 7.2706, x: 8.598, y: 8.523, z: -0.555
            },
            highlightMesh: () => {

            },
        }
    ],
    [FeatureCategory.Safety]: [
        {
            title: "Max Visibility", content: "LED headlights and tail lights improves night visibility.",
            camera: {
                alpha: 7.0768, beta: 1.3214, radius: 36.0000, x: 3.524, y: 5.788, z: -3.535
            },
            highlightMesh: () => {
                blinkAnimation("Indicator_Glow", 1000);
                makeSceneDarkAnimation()
            },
            showMesh: ["Healight_Glow", "Indicator_Glow", "LightBeam", "Backlight_Glow"]
        },
        {
            title: "Twin-Axis ORVMs", content: "Twin-axis ORVMs provide clear view for enhanced safety.",
            camera: {
                alpha: 2.9987, beta: 1.5045, radius: 3.5006, x: 3.153, y: 9.926, z: 5.607
            },
            highlightMesh: () => addHighlights("Brake_Motor_primitive0", false),
            // dontringHighlightObjectToTop : true,
        },
        {
            title: "Water Wading Power", content: "500 mm water wading capacity ensures an all-weather use.",
            camera: {
                alpha: 1.4597, beta: 1.5923, radius: 40.9816, x: -0.010, y: 8.711, z: -0.026
            },
            animationsToPlayInLoop: ["Rotation_Rear_Tyre_Action", "Rotation_Front_Tyre_Action"],
            highlightMesh: () => {
                updateStaticText("Water Wading Power", "500 mm", 12, "column", true);
                showStaticText();
            },
            animations: WaterWadingAnimation,
            // isSleepOnAutoMode: 5000
        },
        {
            title: "Effortless braking", content: "200 mm drum brakes offer the shortest braking distance.",
            camera: {
                alpha: -1.1056, beta: 1.4381, radius: 13.5176, x: 7.864, y: 1.464, z: 3.556
            },
            highlightMesh: () => {
            },
        },
        {
            title: "Max Stability", content: "And superior wheelbase that resists front lifting.",
            camera: {
                alpha: 1.4597, beta: 1.5923, radius: 40.9816, x: -0.010, y: 8.711, z: -0.026
            },
            highlightMesh: () => {
                updateStaticText("", "Superior wheelbase", 12, "column");
                showStaticText();
            },
        }
    ],
    [FeatureCategory.Technology]: [
        {
            title: "Futuristic tech", content: "26 smart connected features for convenience and safety.",
            camera: {
                alpha: 3.1767, beta: 0.9498, radius: 2.5000, x: 6.281, y: 10.229, z: -0.028
            },
            resetToDefaultPositionFirst: true,
            highlightMesh: async () => {
                addHighlights("Cluster", false);
            },
            zoomEffect: false,
            animations: [

            ],
        },
        {
            title: "Park with ease", content: "Concealed Parking Lever. Clean & clutter-free cabin.",
            camera: {
                alpha: 1.5538, beta: 1.5827, radius: 26.0183, x: 6.187, y: 8.283, z: -1.081
            },
            resetToDefaultPositionFirst: true,
            highlightMesh: () => addHighlights("Engine_low", true),
        },
        {
            title: "Wipe it off", content: "Zero-position wiper offer smooth operation for clear view.",
            camera: {
                alpha: -0.0327, beta: 1.5190, radius: 19.7695, x: -0.443, y: 10.344, z: -0.870
            },
            resetToDefaultPositionFirst: true,
            animations: [
            ],
            highlightMesh: () => { },
        },
        {
            title: "Regenerative Braking", content: "Regenerative braking for smarter energy use & extended range.",
            camera: {
                alpha: -1.0039, beta: 1.4995, radius: 11.0378, x: 8.841, y: 2.159, z: 0.203
            },
            resetToDefaultPositionFirst: true,
            showMesh: ["E_Charge_1", "E_Charge_2", "E_Charge_3", "E_Charge_4", "Regen_Brake"],
            animations: [
                {
                    name: "E_Charge_1_Action",
                    sequence: 0,
                    speed: 1,
                    loop: true,
                    startFrame: 0,
                    endFrame: null,
                    reverse: false
                },
                {
                    name: "E_Charge_2_Action",
                    sequence: 0,
                    speed: 1,
                    loop: true,
                    startFrame: 0,
                    endFrame: null,
                    reverse: false
                },
                {
                    name: "E_Charge_3_Action",
                    sequence: 0,
                    speed: 1,
                    loop: true,
                    startFrame: 0,
                    endFrame: null,
                    reverse: false
                },
                {
                    name: "E_Charge_4_Action",
                    sequence: 0,
                    speed: 1,
                    loop: true,
                    startFrame: 0,
                    endFrame: null,
                    reverse: false
                },
            ],
            highlightMesh: () => addHighlights("Regen_Brake", false),
        },
        {
            title: "Tripod Drive Shaft", content: "Tripod drive shaft ensures durability and zero maintenance.",
            camera: {
                alpha: -3.9129, beta: 1.3301, radius: 23.5389, x: -2.737, y: 2.448, z: -2.289
            },
            resetToDefaultPositionFirst: true,
            showMesh: ["E_Charge_1", "E_Charge_2", "E_Charge_3", "E_Charge_4", "Regen_Brake"],
            animations: [
                {
                    name: "E_Charge_1_Action",
                    sequence: 0,
                    speed: 1,
                    loop: true,
                    startFrame: 0,
                    endFrame: null,
                    reverse: false
                },
                {
                    name: "E_Charge_2_Action",
                    sequence: 0,
                    speed: 1,
                    loop: true,
                    startFrame: 0,
                    endFrame: null,
                    reverse: false
                },
                {
                    name: "E_Charge_3_Action",
                    sequence: 0,
                    speed: 1,
                    loop: true,
                    startFrame: 0,
                    endFrame: null,
                    reverse: false
                },
                {
                    name: "E_Charge_4_Action",
                    sequence: 0,
                    speed: 1,
                    loop: true,
                    startFrame: 0,
                    endFrame: null,
                    reverse: false
                },
            ],
            highlightMesh: () => addHighlights("Regen_Brake", false),
        }
    ],
    [FeatureCategory.Convenience]: [
        {
            title: "Power Gear", content: "Industry-first With 3 Drive Modes for superior gradeability & range.",
            camera: {
                alpha: -3.0688, beta: 1.4638, radius: 5.5, x: 8.483, y: 8.806, z: -0.071
            },
            resetToDefaultPositionFirst: true,
            highlightMesh: () => addHighlights("Charger_Box_primitive0", false),
            hideMesh: ["Softop_Curtain_primitive0", "Softop_Curtain_primitive1"],
            // minZ: 6
        },
        {
            title: "Turn with Ease", content: "Low turning radius ensure easy maneuvering in tight spaces.",
            camera: {
                alpha: -0.0063, beta: 0.8711, radius: 27.2686, x: 4.208, y: 2.060, z: -1.428
            },
            resetToDefaultPositionFirst: true,
            animationsToPlay: ["Rotation_USB_Port_Action"],
            animations: [
                {
                    name: "Rotation_USB_Port_Action",
                    sequence: 0,
                    speed: 1,
                    loop: false,
                    startFrame: 0,
                    endFrame: null,
                    reverse: false,
                    onComplete: () => addHighlights("USB_Charging_Port", false)
                },
            ]
        },
        {
            title: "USB Charging Port", content: "USB charging port always keeps you connected.",
            camera: {
                alpha: 3.6019, beta: 1.1940, radius: 1.2, x: 8.528, y: 8.047, z: -1.306
            },
            // resetToDefaultPositionFirst: true,
            highlightMesh: () => highlightMeshUsingOverlayAndAlpha(["SoftTop_Cloth"], "Tumble_Seat"),
            // hideMesh: ["Soft_Top"],
            zoomInSmoothDuration : 2000,
            zoomInSpeed: 0.5,
            animationsToPlay: ["Rotation_Tumble_Seat_Action"],
            animations: [
                {
                    name: "Rotation_Tumble_Seat_Action",
                    sequence: 0,
                    speed: 1,
                    loop: false,
                    startFrame: 0,
                    endFrame: null,
                    reverse: false,
                    // onComplete: () => {addHighlights("Tumble_Seat", false)}
                },
            ]

        },
        {
            title: "Lockable Glove Box", content: "Lockable glove box keeps your essentials safe.",
            camera: {
                alpha: 3.1396, beta: 0.9429, radius: 6.0383, x: 7.137, y: 8.812, z: -2.879
            },
            resetToDefaultPositionFirst: true,
            animations: [

            ]
        },
        {
            title: "Easy Access", content: "Easy ingress & egress for quick access & smooth operation.",
            camera: {
                alpha: 1.4900, beta: 1.5240, radius: 30.9820, x: 3.941, y: 7.770, z: -0.428
            },
            resetToDefaultPositionFirst: true,
            animations: [

            ]
        },
    ],
    [FeatureCategory.HeavyDuty]: [
        {
            title: "Max Load Deck", content: "Highest Loading area in the segment (6.6 ft deck length).",
            camera: {
                alpha: 0.8783, beta: 1.4020, radius: 35.9819, x: 0.000, y: 7.500, z: 0.000
            },
            highlightMesh: () => {
                updateStaticText("Max load deck", "6.6 Ft", 12, "column");
                showStaticText();
            },
            animations: [

            ]
        },
        {
            title: "Heavy performance", content: "Carry heavy loads With leaf spring suspension.",
            camera: {
                alpha: 1.0326, beta: 1.1495, radius: 27.2871, x: -2.599, y: 7.485, z: 1.560
            },
            animations: [

            ]
        },
        {
            title: "Strong Body", content: "Reinforced body and chassis ensure lasting durability.",
            camera: {
                alpha: 2.4200, beta: 1.3272, radius: 36.0000, x: -0.558, y: 7.070, z: -0.472
            },
            animations: [

            ]
        },
        {
            title: "Cover more", content: 'Large 12" tyres provide better stability and load capacity.',
            camera: {
                alpha: 0.6870, beta: 1.2377, radius: 27.2885, x: 3.047, y: 3.990, z: -2.432
            },
            animations: [

            ]
        },
    ],
    AutoPlayTimes: {
        Performance: 58.779,
        Comfort: 25.36,
        Design: 27.25,
        Safety: 30.589,
        Technology: 31.096,
        Convenience: 27.352,
        HeavyDuty: 22.062,
    }
};
