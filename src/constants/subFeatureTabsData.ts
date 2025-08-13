import { showChargingInfographics } from "../uiElements/infographics/chargingText";
import { startIncrementingText } from "../uiElements/infographics/rangeText";
import { showStaticText, updateStaticText } from "../uiElements/infographics/staticText";
import { blinkAnimation, makeSceneDarkAnimation, prepareAndPlayAnimations, shineAnimation, slowAndStopAnimation, startSpeedLines, stopSpeedLines } from "../utils/animations";
import { startRotateCamera360 } from "../utils/cameraRotation";
import { addHighlights, applyOutlineToMesh, highlightMeshUsingOverlayAndAlpha, highlightMeshUsingTransparencyMode } from "../utils/highlights";
import { animateMaterialTextureUOffset, hideMeshes, makeMeshVisible, setRenderingGroupId, sleep } from "../utils/utils";
import { coverMoreBrakingAnimation, easyAccessAnimation, effortlessBrakingAnimation, futuristicTechAnimation, gloveBoxAnimation, GradeabilityAnimation, highGroundClearingEaseAnimation, maxStabilityAnimation, orvmAnimation, parkingBrakeAnimation, rollingWindowsAnimation, rollingWindowsAnimationForRoofTrim, turnWithEaseAnimation, WaterWadingAnimation, wheelAnimation, wiperAnimation } from "./animationData";
import { FeatureCategory } from "./enums";
import { CAMERA_DEFAULT_TARGET_POSITION_X, CAMERA_DEFAULT_TARGET_POSITION_Y, CAMERA_DEFAULT_TARGET_POSITION_Z, CAMERA_DEFAULT_ALPHA_VALUE, CAMERA_DEFAULT_BETA_VALUE, CAMERA_DEFAULT_DESKTOP_RADIUS_VALUE, HIGHLIGHT_COLOR } from "./values";

export const subFeatureTabsData = {
    [FeatureCategory.Performance]: [
        {
            title: "Max pick up", content: "Class-leading 0-30 pickup in 5.9 seconds, even with load.",
            camera: {
                alpha: 0.8370, beta: 1.0395, radius: 22.2872, x: -0.723, y: 7.612, z: 0.695
            },
            showMesh:["Pickup_Line"],
            highlightMesh: () => {
                // addHighlights("Engine_N603", true)
                updateStaticText("Pickup in 5.9 secs", "0-30 KM/Hr", 12, "column");
                showStaticText();
                applyOutlineToMesh("Engine_N603")
                applyOutlineToMesh("Pickup_Line")
                animateMaterialTextureUOffset("Max_Speed_Mat", -0.02)
            },
            animations: wheelAnimation
        },
        {
            title: "Max speed", content: "Top speed of 60 km/h ensure faster deliveries, more profit.",
            camera: {
                alpha: 1.4597, beta: 1.5923, radius: 40.9816, x: -0.010, y: 8.711, z: -0.026
            },
            showMesh: ["Aero_Dynamics"],
            highlightMesh: () => {
                updateStaticText("Max Speed", "60 Km/h", 12, "column", true);
                showStaticText();
                animateMaterialTextureUOffset("Aerodynamics", -0.04)
            },
            animations: wheelAnimation
        },
        {
            title: "Always be ready", content: "Fastest Charging Time 0-100% in just 3 hours 10 minutes.",
            camera: {
                alpha: 1.0783, beta: 1.2186, radius: 34.7685, x: -1.084, y: 7.718, z: 0.535
            },
            showMesh: ["Charging_Status"],
            highlightMesh: () => {
                // addHighlights("Battery_Pack_N603_primitive0")
                applyOutlineToMesh("Battery_Pack_N603_primitive0",)
                applyOutlineToMesh("Charging_Status", true, 0.00001)
                showChargingInfographics();
                animateMaterialTextureUOffset("Charging_Mat", -0.01)
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
            title: "Go Far", content: "Travel longer with 156 km (FSD) real-world range.",
            camera: {
                alpha: 1.4597, beta: 1.5923, radius: 40.9816, x: -0.010, y: 8.711, z: -0.026
            },
            resetToDefaultPositionFirst: true,
            isRoadAnim: true,
            showMesh: ["Milestone", "Load_1", "Load_2", "Load_3"],
            highlightMesh: () => {
                startIncrementingText();

            },
            animations: [
                ...wheelAnimation,
                {
                    name: "Milestone_Action",
                    sequence: 0,
                    speed: 1,
                    loop: false,
                    startFrame: 0,
                    endFrame: null,
                    reverse: false,
                    noOfIterations: 3,
                    iterationEndFrame: 50,
                    // showMesh:["179_Text","KMS_Text"],
                    onIterationComplete: (iterationNo: number) => {
                        if (iterationNo == 3) {
                            slowAndStopAnimation(["Tyre_Rear_Action", "Tyre_Front_Rotation_Action ", "roadAnim"]);
                            makeMeshVisible("179_Text");
                            makeMeshVisible("KMS_Text");
                        }
                    }
                },
            ]
        },
        {
            title: "Carry More", content: "192 Cubic Feet of Volumetric Capacity. Carry more per trip.",
            camera: {
                alpha: 0.7058, beta: 1.2776, radius: 49.7506, x: 0.198, y: 10.214, z: -1.562
            },
            showMesh: ["Container", "Container_Frame"],
            highlightMesh: () => {
                // startIncrementingText()
                updateStaticText("Volumetric Capacity", "192 Cubic ft", 12, "column", true);
                showStaticText();
            },
            animations: [
            ]
        },
        {
            title: "Climb Confidently", content: "Gradeability of 28.7 %. Drive on slopes with confidence.",
            camera: {
                alpha: 1.5152, beta: 1.6500, radius: 40.2500, x: -1.190, y: 13.300, z: -0.040
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
            animations: highGroundClearingEaseAnimation
        },
        {
            title: "Peace of Mind", content: "Worry-free drives with 6yr/1.5 lakh km warranty.",
            camera: {
                alpha: -0.0409, beta: 1.5515, radius: 36.0000, x: 0.000, y: 7.500, z: 0.000
            },
            highlightMesh: () => {
                updateStaticText("Warranty", "6yr/1.5 Lakh KMs", 12, "column");
                showStaticText();
                startRotateCamera360();
                // startIncrementingText()
            },
            zoomEffect: false,
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
                addHighlights("Window_L", false);
                applyOutlineToMesh("Window_L", false, 0.2)
            },
            animations: rollingWindowsAnimation
        },
        {
            title: "Roof Trim Provision", content: "Segment-First Roof Trim reduces cabin temperature by up to 6°C.",
            camera: {
                alpha: 1.9459, beta: 1.6500, radius: 8.5564, x: 5.298, y: 10.156, z: 2.326
            },
            highlightMesh: () => {
                // addHighlights("Roof_Trim_Provision", false);

                // hideMeshes(["Window_L"])
            },
            animations: rollingWindowsAnimationForRoofTrim
        },
        {
            title: "Bump-Free Drive", content: "Dual-rate suspension ensure smooth rides on rough terrain.",
            camera: {
                alpha: -0.9133, beta: 1.4895, radius: 17.2698, x: 4.788, y: 1.932, z: 5.435
            },
            highlightMesh: () => {
                addHighlights("Suspension_Fork_F");
                addHighlights("Suspension_Spring_F");

            },
        },
        {
            title: "Relaxed Drive", content: "Wide-backed ergonomic seat offers superior driving comfort.",
            camera: {
                alpha: -5.8645, beta: 1.0734, radius: 13.5185, x: 1.369, y: 7.140, z: -1.733
            },
            showMesh: ["Seat_Wireframe"],

            highlightMesh: () => {
                hideMeshes(["Large_Windshield  "])
                // addHighlights("Seat_primitive0", true);
                // addHighlights("Seat_Backrest_primitive0", true);
                // addHighlights("Seat_Wireframe", true);

                // applyOutlineToMesh("Seat_primitive0", true)
                // applyOutlineToMesh("Seat_Backrest_primitive0", true)
            },
            animations: [

            ]
        },
    ],
    [FeatureCategory.Design]: [
        {
            title: "Sleek Headlamp mask", content: "With 3D Stallion logo featuring sleek, premium-fit textures.",
            camera: {
                alpha: -0.0180, beta: 1.5391, radius: 25.9992, x: -0.030, y: 7.524, z: -0.900
            },
            // resetToDefaultPositionFirst : true,
            highlightMesh: () => {
                addHighlights("Sleek_Headlamp_MAsk", false);
                applyOutlineToMesh("Sleek_Headlamp_MAsk", false, 500)
                animateMaterialTextureUOffset("Sleek_Headlamp_Mat", -0.02, -1)

                // shineAnimation("Glossy_Copper", 0, -1, 120, HIGHLIGHT_COLOR)
            },
        },
        {
            title: "Large Windshield", content: "Large bonded windshield ensures clear visibility & safety.",
            camera: {
                alpha: 3.1631, beta: 1.4966, radius: 8.5387, x: 8.470, y: 11.193, z: -0.592
            },
            highlightMesh: () => {
                addHighlights("Large_Windshield  ", false)
                hideMeshes(["Cabin_Glass_primitive0", "Cabin_Glass_primitive1"])

            },
        },
        {
            title: "Upscale Cabin", content: "Spacious Cabin with inner door trim & plush interiors.",
            camera: {
                alpha: 9.4427, beta: 1.1979, radius: 4.7515, x: 6.213, y: 9.909, z: -0.681, fov: 1.2135
            },
            // highlightMesh: () => addHighlights("Front_Fender", false),
        },
        {
            title: "Elegant Dashboard", content: "Piano black bezel design for a premium in-cabin experience.",
            camera: {
                alpha: 3.1720, beta: 0.8943, radius: 7.2706, x: 8.598, y: 8.523, z: -0.555
            },
            highlightMesh: () => {
                animateMaterialTextureUOffset("Plastic_Black_Glossy", -0.01, -0.9)

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
            showMesh: ["Headlight_Emission", "Headlight_Beam", "Backlight_Emisson"]
        },
        {
            title: "Twin-Axis ORVMs", content: "Twin-axis ORVMs provide clear view for enhanced safety.",
            camera: {
                alpha: 2.9987, beta: 1.5045, radius: 3.5006, x: 3.153, y: 9.926, z: 5.607
            },
            highlightMesh: () => {
                addHighlights("Mirror_Axis_L2_primitive0", false)
                addHighlights("Mirror_Axis_L1", false)
            },
            animations: orvmAnimation,
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
                addHighlights("Drum_Brake_Front_primitive0", false)
            },
            animations: effortlessBrakingAnimation
        },
        {
            title: "Max Stability", content: "And superior wheelbase that resists front lifting.",
            camera: {
                alpha: 1.4597, beta: 1.5923, radius: 40.9816, x: -0.010, y: 8.711, z: -0.026
            },
            showMesh: ["Max_Stability_Arrow"],
            highlightMesh: () => {
                updateStaticText("", "Superior wheelbase", 12, "column");
                showStaticText();
            },
            animations: maxStabilityAnimation
        }
    ],
    [FeatureCategory.Technology]: [
        {
            title: "Futuristic tech", content: "26 smart connected features for convenience and safety.",
            camera: {
                alpha: 3.1362, beta: 1.1701, radius: 2.5000, x: 6.488, y: 10.258, z: -0.441
            },
            resetToDefaultPositionFirst: true,
            highlightMesh: async () => {
                addHighlights("Cluster", false);
            },
            zoomEffect: false,
            animations: futuristicTechAnimation,
        },
        {
            title: "Park with ease", content: "Concealed Parking Lever. Clean & clutter-free cabin.",
            camera: {
                alpha: 2.2191, beta: 1.5383, radius: 18.4993, x: 7.379, y: 5.712, z: -0.644
            },
            resetToDefaultPositionFirst: true,
            highlightMesh: () => {

                // hideMeshes(["Door_L_primitive0", "Door_L_primitive1", "Door_L_primitive2", "Door_L_primitive3",
                //     "Door_L_primitive4", "Door_L_primitive5", "Door_L_primitive6", "Graphics_Left_Door", "Window_L"]);

            },
            animations: parkingBrakeAnimation
        },
        {
            title: "Wipe it off", content: "Zero-position wiper offer smooth operation for clear view.",
            camera: {
                alpha: -0.0327, beta: 1.5190, radius: 19.7695, x: -0.443, y: 10.344, z: -0.870
            },
            resetToDefaultPositionFirst: true,
            animations: wiperAnimation,
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

            // resetToDefaultPositionFirst: true,
            // showMesh: [],
            animations: [
            ],
            highlightMesh: () => {
                addHighlights("Drive_Shaft");
                applyOutlineToMesh("Drive_Shaft", true, 0.1)

            },
        }
    ],
    [FeatureCategory.Convenience]: [
        {
            title: "Power Gear", content: "Industry-first Power Gear with 3 Drive Modes for superior gradeability & range.",
            camera: {
                alpha: -3.0688, beta: 1.4638, radius: 5.5, x: 8.483, y: 8.806, z: -0.071
            },
            resetToDefaultPositionFirst: true,
            highlightMesh: () => {
                addHighlights("Power_Gear_N603_primitive1", false)
                addHighlights("Power_Gear_N603_primitive0", false)
                addHighlights("Drive_Modes_primitive0", false)
                addHighlights("Drive_Modes_primitive1", false)
            },
            hideMesh: ["Softop_Curtain_primitive0", "Softop_Curtain_primitive1"],
            // minZ: 6
        },
        {
            title: "Turn with Ease", content: "Low turning radius ensure easy maneuvering in tight spaces.",
            camera: {
                alpha: -0.0063, beta: 0.8711, radius: 27.2686, x: 4.208, y: 2.060, z: -1.428
            },
            // showMesh: ["Turning_Path"],
            highlightMesh: () => {
                // animateMaterialTextureUOffset("Turning_Path", -0.01)
            },
            animations: turnWithEaseAnimation
        },
        {
            title: "USB Charging Port", content: "USB charging port always keeps you connected.",
            camera: {
                alpha: 3.6019, beta: 1.1940, radius: 1.2, x: 8.528, y: 8.047, z: -1.306
            },
            // resetToDefaultPositionFirst: true,
            highlightMesh: () => {
                // highlightMeshUsingOverlayAndAlpha("Tumble_Seat", ["SoftTop_Cloth"])
            },
            // hideMesh: ["Soft_Top"],
            zoomInSmoothDuration: 2000,
            zoomInSpeed: 0.5,
            animationsToPlay: ["Rotation_Tumble_Seat_Action"],
            animations: [
                {
                    name: "USB_Charging_Port_Action",
                    sequence: 0,
                    speed: 1,
                    loop: false,
                    startFrame: 0,
                    endFrame: null,
                    reverse: false,
                    onComplete: () => {
                        addHighlights("USB_Port_primitive0", false);
                        applyOutlineToMesh("USB_Port_primitive0", false, 0.05)
                    }
                },
            ]

        },
        {
            title: "Lockable Glove Box", content: "Lockable glove box keeps your essentials safe.",
            camera: {
                alpha: 3.1396, beta: 0.9429, radius: 6.0383, x: 7.137, y: 8.812, z: -2.879
            },
            resetToDefaultPositionFirst: true,
            animations: gloveBoxAnimation
        },
        {
            title: "Easy Access", content: "Easy ingress & egress for quick access & smooth operation.",
            camera: {
                alpha: 1.6848, beta: 1.5126, radius: 32.2127, x: 3.941, y: 7.770, z: -0.428
            },
            resetToDefaultPositionFirst: true,
            highlightMesh: () => {
                // hideMeshes(["Door_L_primitive0", "Door_L_primitive1", "Door_L_primitive2", "Door_L_primitive3",
                //     "Door_L_primitive4", "Door_L_primitive5", "Door_L_primitive6", "Graphics_Left_Door", "Window_L"])
            },
            animations: easyAccessAnimation
        },
    ],
    [FeatureCategory.HeavyDuty]: [
        {
            title: "Max Load Deck", content: "Highest Loading area in the segment (6.6 ft deck length).",
            camera: {
                alpha: 0.8813, beta: 1.2949, radius: 37.2009, x: -0.614, y: 9.566, z: -0.252
            },
            highlightMesh: () => {
                updateStaticText("Max load deck", "6.6 Ft", 12, "column");
                showStaticText();
                applyOutlineToMesh("Load_3", false);
                animateMaterialTextureUOffset("Orange", -0.02)
                
            },
            showMesh: ["Milestone", "Load_1", "Load_2", "Load_4", "Max_Load_Text", "Max_Load_Text_2"],
            animations: [

            ]
        },
        {
            title: "Heavy performance", content: "Carry heavy loads With leaf spring suspension.",
            camera: {
                alpha: 1.0326, beta: 1.1495, radius: 27.2871, x: -2.599, y: 7.485, z: 1.560
            },
            showMesh: ["Load_1", "Load_2", "Load_3"],
            highlightMesh: () => {
                addHighlights("Leaf_Spring");
                applyOutlineToMesh("Leaf_Spring")
                addHighlights("Rear_Suspension_Setup_primitive0");
                applyOutlineToMesh("Rear_Suspension_Setup_primitive0")
                addHighlights("Rear_Suspension_Setup_primitive1");
                applyOutlineToMesh("Rear_Suspension_Setup_primitive1")
            },
            animations: [

            ]
        },
        {
            title: "Strong Body", content: "Reinforced body and chassis ensure lasting durability.",
            camera: {
                alpha: 2.4200, beta: 1.3272, radius: 36.0000, x: -0.558, y: 7.070, z: -0.472
            },
            highlightMesh: () => {
                highlightMeshUsingTransparencyMode("Chassis_Mat")
            },
            animations: [

            ]
        },
        {
            title: "Cover more", content: 'Large 12" tyres provide better stability and load capacity.',
            camera: {
                alpha: 0.6870, beta: 1.2377, radius: 27.2885, x: 3.047, y: 3.990, z: -2.432
            },
            highlightMesh: () => {
                addHighlights("Tyre_R_primitive2", false);
                addHighlights("Tyre_R_primitive0", false);
                addHighlights("Tyre_F_primitive0", false);
                addHighlights("Tyre_F_primitive2", false);
            },
            animations: coverMoreBrakingAnimation
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
