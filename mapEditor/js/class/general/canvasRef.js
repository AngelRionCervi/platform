const renderer = document.getElementById("mapEditorCanvas");

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

export const app = new PIXI.Application({
    width: renderer.width,
    height: renderer.height,
    antialias: true,
    transparent: true,
    resolution: 1,
    view: renderer,
});

export const sceneContainer = new PIXI.Container();
sceneContainer.name = "scene";
export const helperGridContainer = new PIXI.Container();
sceneContainer.name = "helperGrid";
export const entityContainer = new PIXI.Container();
sceneContainer.name = "entities";

app.stage.addChild(sceneContainer, entityContainer, helperGridContainer);


export function getCanvas() {
    return document.getElementById("mapEditorCanvas");
}

export function getContext() {
    return getCanvas().getContext("2d");
}

export function getGridDiv() {
    return document.getElementById('canvas_grid');
}