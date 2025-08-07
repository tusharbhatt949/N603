import { ASSETS } from "../constants/assets";
import { FeatureCategory } from "../constants/enums";
import { normalizeKey } from "../uiElements/sidebar/sidebar";

let currentAudio: HTMLAudioElement | null = null; // Store the currently playing audio
let isMuted = false
export const stopCurrentAudio = (): void => {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0; // Reset to the start
        currentAudio = null; // Clear reference
    }
};

export const pauseAudio = (): void => {
    if (currentAudio && !currentAudio.paused) {
        currentAudio.pause();
    }
};

export const resumeAudio = (): void => {
    if (currentAudio && currentAudio.paused) {
        currentAudio.play();
    }
};

export const toggleMuteUnmute = (): void => {
    if (isMuted) {
        unmuteAudio();
    } else {
        muteAudio();
    }
    isMuted = !isMuted; // Toggle the state
    updateVolumeIcon(); // Update the icon accordingly
};

export const muteAudio = (): void => {
    if (currentAudio) {
        currentAudio.volume = 0;
    }
};

export const unmuteAudio = (): void => {
    if (currentAudio) {
        currentAudio.volume = 1;
    }
};

// Function to update the volume icon based on the mute state
const updateVolumeIcon = () => {
    const volumeIcon = document.querySelector("#volume-icon") as HTMLImageElement;
    if (volumeIcon) {
        volumeIcon.src = isMuted ? ASSETS.HEADERICONS.volumeOff : ASSETS.HEADERICONS.volumeOn;
    }
};


interface Voiceovers {
    [category: string]: { [tabNumber: number]: string };
}

interface Config {
    voiceovers: Voiceovers;
}

declare const config: Config;
// declare let isMuted: boolean;

export const playVoiceOver = (category: FeatureCategory, tabNo: number): Promise<void> => {
    return new Promise((resolve, reject) => {
        const voiceovers = ASSETS.VOICEOVERS;
        const key = (tabNo + 1).toString(); // Convert number to string for indexing
        const normalizedCategory = normalizeKey(category)
        // @ts-ignore
        if (voiceovers[normalizedCategory] && voiceovers[normalizedCategory][tabNo + 1]) {
            stopCurrentAudio(); // Stop any ongoing audio before playing a new one

            // @ts-ignore
            currentAudio = new Audio(voiceovers[normalizedCategory][tabNo + 1]);
            currentAudio.volume = isMuted ? 0 : 1; // Apply global mute state

            currentAudio.play().then(() => {
            }).catch(error => {
                // console.error("Error playing audio:", error);
                reject(error);
            });

            // Event listener to detect when audio has finished playing
            currentAudio.onended = () => {
                currentAudio = null; // Clear reference when audio ends
                resolve();
            };
        } else {
            reject(new Error("Voiceover not found"));
        }
    });
};