import { normalizeKey } from "../uiElements/sidebar/sidebar";
import { FeatureCategory } from "./enums";

export const ASSETS = {
    MESHES: {
        vehicleEnvironment: "assets/meshes/ENVIRONMENT/EV_MAX_Environment.gltf",
        vehicle: "assets/meshes/VEHICLE/TVS_N603.gltf"
    },
    ENV: {
        envfile: "assets/envfile/environment.env"
    },
    SIDEBAR: {

        [normalizeKey(FeatureCategory.Performance)]: "assets/sidebarIcons/performance.svg",
        [normalizeKey(FeatureCategory.Comfort)]: "assets/sidebarIcons/comfort.svg",
        [normalizeKey(FeatureCategory.Design)]: "assets/sidebarIcons/design.svg",
        [normalizeKey(FeatureCategory.Convenience)]: "assets/sidebarIcons/convenience.svg",
        [normalizeKey(FeatureCategory.Safety)]: "assets/sidebarIcons/safety_v1.svg",
        [normalizeKey(FeatureCategory.Technology)]: "assets/sidebarIcons/technology.svg",
        [normalizeKey(FeatureCategory.HeavyDuty)]: "assets/sidebarIcons/heavyduty.svg",

        // other sidebar icons
        carrot: "assets/sidebarIcons/carrot.svg",
        colorSelectedWhite: "assets/sidebarIcons/colorSelectedWhite.svg",
        colorSelectedBlue: "assets/sidebarIcons/colorSelectedBlue.svg",
        collapseIcon : "assets/sidebarIcons/collapse.svg",
        expandIcon : "assets/sidebarIcons/expand.svg",
    },
    VOICEOVERS: {
        [normalizeKey(FeatureCategory.Performance)]: {
            1: "assets/voiceovers/performance_1.mp3",
            2: "assets/voiceovers/performance_2.mp3",
            3: "assets/voiceovers/performance_3.mp3",
            4: "assets/voiceovers/performance_4.mp3",
            5: "assets/voiceovers/performance_5.mp3",
            6: "assets/voiceovers/performance_6.mp3",
            7: "assets/voiceovers/performance_7.mp3",
            8: "assets/voiceovers/performance_8.mp3",
        },
        [normalizeKey(FeatureCategory.Comfort)]: {
            1: "assets/voiceovers/comfort_1.mp3",
            2: "assets/voiceovers/comfort_2.mp3",
            3: "assets/voiceovers/comfort_3.mp3",
            4: "assets/voiceovers/comfort_4.mp3",
        },
        [normalizeKey(FeatureCategory.Design)]: {
            1: "assets/voiceovers/design_1.mp3",
            2: "assets/voiceovers/design_2.mp3",
            3: "assets/voiceovers/design_3.mp3",
            4: "assets/voiceovers/design_4.mp3",
        },
        [normalizeKey(FeatureCategory.Convenience)]: {
            1: "assets/voiceovers/convenience_1.mp3",
            2: "assets/voiceovers/convenience_2.mp3",
            3: "assets/voiceovers/convenience_3.mp3",
            4: "assets/voiceovers/convenience_4.mp3",
            5: "assets/voiceovers/convenience_5.mp3",
        },
        [normalizeKey(FeatureCategory.Safety)]: {
            1: "assets/voiceovers/safety_1.mp3",
            2: "assets/voiceovers/safety_2.mp3",
            3: "assets/voiceovers/safety_3.mp3",
            4: "assets/voiceovers/safety_4.mp3",
            5: "assets/voiceovers/safety_5.mp3",
        },
        [normalizeKey(FeatureCategory.Technology)]: {
            1: "assets/voiceovers/technology_1.mp3",
            2: "assets/voiceovers/technology_2.mp3",
            3: "assets/voiceovers/technology_3.mp3",
            4: "assets/voiceovers/technology_4.mp3",
            5: "assets/voiceovers/technology_5.mp3",
        },
        [normalizeKey(FeatureCategory.HeavyDuty)]: {
            1: "assets/voiceovers/heavyduty_1.mp3",
            2: "assets/voiceovers/heavyduty_2.mp3",
            3: "assets/voiceovers/heavyduty_3.mp3",
            4: "assets/voiceovers/heavyduty_4.mp3",
        }
    },
    LOGO : {
        tvsKingEvMaxLogo : "assets/headerIcons/vehicle_logo.webp",
    },
    HEADERICONS :  {
        fullScreen : "assets/headerIcons/fullscreen_v1.svg",
        fullScreenExit : "assets/headerIcons/fullscreen-exit_v1.svg",
        volumeOn : "assets/headerIcons/volumeOn_v1.svg",
        volumeOff : "assets/headerIcons/volumeOff_v1.svg",
        play : "assets/headerIcons/play_v1.svg",
        playAutoplay : "assets/headerIcons/play_Autoplay.svg",
        pause : "assets/headerIcons/pause_v1.svg",
        home : "assets/headerIcons/home_v1.svg",
        cabinView : "assets/headerIcons/cabinView_v1.svg",
        cabinViewExit : "assets/headerIcons/cabinViewExit_v1.svg",
    },
    OTHERS : {
        rotateScreen : "assets/other/rotateScreen.gif",
        ao : "assets/meshes/ao.png",
        particleSystemLeft : "assets/meshes/particleSystem_left.json",
        particleSystemRight : "assets/meshes/particleSystem_right.json",
        waterShader : "assets/meshes/Water_Shader.json",
        hotspotImage : "assets/other/hotspot.png",
        hotspotMaterial : "assets/meshes/hotspotMaterial.json",
        iconMaterial : "assets/meshes/iconMaterial.json",
        textMaterial : "assets/meshes/textMaterial.json",
        exitIcon : "assets/other/exit-v1.svg",
        nextIcon : "assets/other/next-v1.svg",
        replayIcon : "assets/other/replay.svg",
        startIcon : "assets/other/start.svg",
    }
}