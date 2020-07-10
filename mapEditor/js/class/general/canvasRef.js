const renderer = document.getElementById("mapEditorCanvas");

export const app = new PIXI.Application({
    width: renderer.width,
    height: renderer.height,
    antialias: true,
    transparent: true,
    resolution: 1,
    view: renderer,
});

export const container = new PIXI.Container();

export function getCanvas() {
    return document.getElementById("mapEditorCanvas");
}

export function getContext() {
    return getCanvas().getContext("2d");
}

export function getGridDiv() {
    return document.getElementById('canvas_grid');
}