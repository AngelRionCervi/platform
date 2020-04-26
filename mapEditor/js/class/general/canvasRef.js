export function getCanvas() {
    const canvas = document.getElementById("mapEditorCanvas");
    return canvas;
}

export function getContext() {
    const ctx = getCanvas().getContext("2d");
    return ctx;
}