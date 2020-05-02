export function getCanvas() {
    return document.getElementById("mapEditorCanvas");
}

export function getContext() {
    return getCanvas().getContext("2d");
}

export function getGridDiv() {
    return document.getElementById('canvas_grid');
}