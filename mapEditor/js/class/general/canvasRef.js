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
helperGridContainer.name = "helperGrid";
export const entityContainer = new PIXI.Container();
entityContainer.name = "entities";
export const collisionContainer = new PIXI.Container();
collisionContainer.name = "collisions";
export const selectionContainer = new PIXI.Container();
selectionContainer.name = "selections";

app.stage.addChild(sceneContainer, entityContainer, collisionContainer, selectionContainer, helperGridContainer);

export function getCanvas() {
    return document.getElementById("mapEditorCanvas");
}

export function getContext() {
    return getCanvas().getContext("2d");
}

export function getGridDiv() {
    return document.getElementById("canvas_grid");
}
