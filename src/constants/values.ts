export const IS_DEV_ENV = true;
export const DEFAULT_TRANSPARENT_ALPHA_VALUE = 1;
export const DEFAULT_ENVIRONMENT_INTESITY = 1;
export const ANIMATIONS = [];

export const DEFAULT_SCENE_IBL_INTENSITY = 1.0;
// camera default values
export const CAMERA_DEFAULT_ALPHA_VALUE = 0.5;
export const CAMERA_DEFAULT_BETA_VALUE = 1.65;
export const ANIMATION_SPEED_ROTATION = 50;

// camera radius values
export const CAMERA_DEFAULT_DESKTOP_RADIUS_VALUE = 36;
export const CAMERA_DEFAULT_MOBILE_RADIUS_VALUE = 30;
export const CAMERA_DEFAULT_MOBILE_PORTRAIT_RADIUS_VALUE = 55;

// camera radius limit values
export const CAMERA_DESKTOP_LOWER_RADIUS_LIMIT = 0;
export const CAMERA_MOBILE_LOWER_RADIUS_LIMIT = 0.03;

export const CAMERA_DESKTOP_UPPER_RADIUS_LIMIT = 50;
export const CAMERA_PORTRAIT_MOBILE_UPPER_RADIUS_LIMIT = 65;
export const CAMERA_DESKTOP_UPPER_BETA_LIMIT = 1.65;
export const CAMERA_DESKTOP_LOWER_BETA_LIMIT = 0.8;

export const CAMERA_RADIUS_WHEEL_PRECISION = 20
// camera targets values
export const CAMERA_DEFAULT_TARGET_POSITION_X = 0
export const CAMERA_DEFAULT_TARGET_POSITION_Y = 7.5;
export const CAMERA_DEFAULT_TARGET_POSITION_Z = 0.0;

// camera light value
export const DEFAULT_CAMERA_LIGHT_INTENSITY = 1.2;
// camera field of view value
export const CAMERA_DEFAULT_FOV = 0.8;
export const CAMERA_DEFAULT_NEARPLANE = 1;

export const MESHES_TO_HIDE_ON_LOAD = ["E_Charge_1","E_Charge_2","E_Charge_3","E_Charge_4", "Tyre_Hill_Hold","Headlight_Flare",
    "Hill_Hold_Arrow_Head", "Healight_Glow","Indicator_Glow","LightBeam" ,"Regen_Brake","Backlight_Glow","Call_Cube_primitive0","Call_Cube_primitive1","Drive_Mode_Cube_primitive0","Drive_Mode_Cube_primitive1",
    "Milestone","Stop_Sign","Top_Speed_Text","Water_Wading_Text","Hill_Assist_Text","Gradeability_Text","179_Text","KMS_Text", "Hill_Hold_Arrow"
];

export const MESHES_WITH_GLOW_EFFECT = ["Healight_Glow","Indicator_Glow"]

export const PLAY_PAUSE_TOGGLE_COOLDOWN = 600; //ms

export const HIGHLIGHT_COLOR = "#1DF0FF";

export const CABIN_VIEW_CAMERA_POINTS = {
     alpha: -3.1237, beta: 1.2620, radius: 0.2509, x: 2.329, y: 11.370, z: -0.459, fov:1.45
}

// camera: {
//     alpha: -3.1237, beta: 1.2620, radius: 0.2509, x: 2.329, y: 11.370, z: -0.459
// },
