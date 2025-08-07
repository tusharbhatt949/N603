export function createSubFeatureTabs(): HTMLElement {
    const container = document.createElement("div");
    container.id = "subfeature-tabs-container";

    container.innerHTML = `
            <div id="tabs"></div>
            <div id="tab-content"></div>
    `
    return container;
}
