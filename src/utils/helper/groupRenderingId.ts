import { scene } from "../../main";

// Keep track of meshes we modify, so we can restore them later
const modifiedMeshes = new Map<string, number>();

/**
 * Sets the renderingGroupId for a mesh.
 * @param meshName - The name of the mesh in the scene.
 * @param groupId - The rendering group ID to set (default is 1).
 */
export function setMeshRenderingGroupId(meshName: string, groupId: number = 1) {
    const mesh = scene.getMeshByName(meshName);

    if (!mesh) {
        console.warn(`Mesh '${meshName}' not found.`);
        return;
    }

    // Save the original group ID if we haven't saved it before
    if (!modifiedMeshes.has(meshName)) {
        modifiedMeshes.set(meshName, mesh.renderingGroupId);
    }

    mesh.renderingGroupId = groupId;
}

/**
 * Resets all modified meshes to their original renderingGroupId values.
 */
export function resetModifiedMeshesRenderingGroupId() {
    modifiedMeshes.forEach((originalId, meshName) => {
        const mesh = scene.getMeshByName(meshName);
        if (mesh) {
            mesh.renderingGroupId = originalId;
        }
    });

    // Clear the tracking map
    modifiedMeshes.clear();
}
