import { FeatureCategory } from "../../constants/enums";

let isPaused = false;
let elapsedTimes: Record<string, number> = {};
let pauseStartTime: number | null = null;
let currentProgressBarCategory : FeatureCategory | null = null ;
/**
 * Creates progress bars for all categories.
 */
export function CreateAutoModeTimeline(): HTMLElement {
    const container = document.createElement("div");
    container.id = "autoModeTimeline";

    container.innerHTML = Object.values(FeatureCategory).map(category => `
        <div class="category-container">
            <div class="progress-bar" id="progress-bar-${category}">
                <div class="progress-fill" id="progress-fill-${category}"></div>
            </div>
        </div>
    `).join("");

    return container;
}



/**
 * Starts the progress bar animation for a specific category.
 * @param category - The category for which the progress bar should start.
 * @param durationSeconds - Total time (in seconds) for the bar to fill up.
 */
export function startProgressBar(category: FeatureCategory, durationSeconds: number) {
    const progressFill = document.getElementById(`progress-fill-${category}`) as HTMLElement;
    if (!progressFill) return;

    progressFill.style.width = "0%";
    progressFill.style.transition = `width ${durationSeconds}s linear`;

    setTimeout(() => {
        progressFill.style.width = "100%";
    }, 50);

    progressFill.dataset.duration = `${durationSeconds}`;
    progressFill.dataset.startTime = `${Date.now()}`;
    const startTime = Number(progressFill.dataset.startTime)
    elapsedTimes[category] = 0;  // Reset elapsed time on start
    currentProgressBarCategory = category;
}

/**
 * Pauses the currently animating progress bar.
 */
export function pauseProgressBar() {
    if (isPaused || !currentProgressBarCategory) return;
    isPaused = true;
    pauseStartTime = Date.now();

    const progressFill = document.getElementById(`progress-fill-${currentProgressBarCategory}`) as HTMLElement;
    if (!progressFill) return;

    const computedStyle = window.getComputedStyle(progressFill);
    if (computedStyle.width === "0px" || computedStyle.width === computedStyle.maxWidth) return; // Skip if not animating

    progressFill.style.width = computedStyle.width;
    progressFill.style.transition = "none";

    // Corrected elapsed time calculation
    const startTime = Number(progressFill.dataset.startTime || 0);
    elapsedTimes[currentProgressBarCategory] += Date.now() - startTime; // Accumulate elapsed time


}

/**
 * Resumes the paused progress bar.
 */
export function resumeProgressBar() {
    if (!isPaused || !currentProgressBarCategory) return;
    isPaused = false;
    const resumeTime = Date.now();

    const progressFill = document.getElementById(`progress-fill-${currentProgressBarCategory}`) as HTMLElement;
    if (!progressFill) return;

    const duration = Number(progressFill.dataset.duration || 0);
    const elapsedTime = elapsedTimes[currentProgressBarCategory] || 0;
    const remainingTime = Math.max(0, duration - elapsedTime / 1000); // Convert to seconds

    if (remainingTime <= 0) return; // Skip if already completed

    progressFill.style.transition = `width ${remainingTime}s linear`;

    setTimeout(() => {
        progressFill.style.width = "100%";
    }, 50);
}

/**
 * Resets all progress bars to 0%.
 */
export function resetProgressBars() {
    isPaused = false;
    elapsedTimes = {};
    pauseStartTime = null;

    Object.values(FeatureCategory).forEach(category => {
        const progressFill = document.getElementById(`progress-fill-${category}`) as HTMLElement;
        if (!progressFill) return;

        progressFill.style.width = "0%";
        progressFill.style.transition = "none";
    });
}
