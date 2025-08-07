import { ArcRotateCameraWithSpin } from "../main";

export function createCopyCameraButton(camera: ArcRotateCameraWithSpin) {
    const button = document.createElement("button");
    button.innerText = "Copy Camera Values";
    button.style.position = "absolute";
    button.style.top = "10px";
    button.style.right = "10px";
    button.style.zIndex = "1000";
    document.body.appendChild(button);

    button.addEventListener("click", () => {
        const { alpha, beta, radius, target } = camera;

        const formatted = `camera: {
    alpha: ${alpha.toFixed(4)}, beta: ${beta.toFixed(4)}, radius: ${radius.toFixed(4)}, x: ${target.x.toFixed(3)}, y: ${target.y.toFixed(3)}, z: ${target.z.toFixed(3)}
},`;

        navigator.clipboard.writeText(formatted)
            .then(() => alert("Camera values copied to clipboard!"))
            .catch(err => console.error("Copy failed:", err));
    });
}
