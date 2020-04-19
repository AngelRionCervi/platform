const canvas = document.getElementById("mapEditorCanvas");
const ctx = canvas.getContext("2d");
const gridDiv = document.getElementById("canvas_grid");

import { Emitter } from "/mapEditor/js/lib/Emitter.js";
import { ContextMenu } from "./class/general/ContextMenu.js";
import { Keyboard } from "./class/keyboardHandling/Keyboard.js";
import { Project } from "./class/project/userProject.js";
import { GridInteraction } from "./class/grid/GridInteraction.js";
import { Grid } from "./class/grid/Grid.js";
import { Assets } from "./class/project/Assets.js";
import { MapDownloader } from "./class/download/MapDownloader.js";
import { Palette } from "./class/palette/Palette.js";
import { PaletteInteraction } from "./class/palette/PaletteInteraction.js";
import { SceneObjectList } from "./class/sceneObjects/SceneObjectList.js";
import { SceneObjectListInteraction } from "./class/sceneObjects/SceneObjectListInteraction.js";
import { GameObjectList } from "./class/gameObjects/GameObjectList.js";
import { GameObjectListInteraction } from "./class/gameObjects/GameObjectListInteraction.js";

const gridInteraction = new GridInteraction();
const grid = new Grid(gridDiv, canvas, ctx);

const _keyboard = new Keyboard();
const paletteInteraction = new PaletteInteraction();
const palette = new Palette(paletteInteraction);
const mapDownloader = new MapDownloader(canvas);
const contextMenu = new ContextMenu(paletteInteraction);
const gameObjectListInteraction = new GameObjectListInteraction();
const gameObjectList = new GameObjectList(gameObjectListInteraction);
const sceneObjectListInteraction = new SceneObjectListInteraction();
const sceneObjectList = new SceneObjectList(sceneObjectListInteraction);
const _assets = new Assets();

let project = null;
let keys = _keyboard.initKeys();

grid.init();
grid.create();
_keyboard.listen();
paletteInteraction.watchDrop();
paletteInteraction.watchDirectoryBack();

_keyboard.emitter.on("keyboard_input_change", ({ detail }) => {
    keys = detail;
    if (!keys.ctrl) grid.stopPan();
});

gridInteraction.emitter.on("grid_left_click", ({ detail }) => {
    if (keys.ctrl) {
        grid.newPanPoint(detail);
    } else {
        handle_Grid_Left_Click_Drawing(detail);
    }
});

gridInteraction.emitter.on("grid_right_click", ({ detail }) => {
    if (keys.ctrl) {
        return;
    } else {
        hanlde_Grid_Right_Click_Drawing(detail);
    }
});

gridInteraction.emitter.on("grid_left_move", ({ detail }) => {
    if (keys.ctrl) {
        grid.pan(detail);
    } else {
        handle_Grid_Left_Click_Drawing(detail);
    }
});

gridInteraction.emitter.on("grid_right_move", ({ detail }) => {
    if (keys.ctrl) {
        return;
    } else {
        hanlde_Grid_Right_Click_Drawing(detail);
    }
});

gridInteraction.emitter.on("add_row", () => {
    grid.addRow();
});

gridInteraction.emitter.on("remove_row", () => {
    grid.removeRow();
});

gridInteraction.emitter.on("add_col", () => {
    grid.addCol();
});

gridInteraction.emitter.on("remove_col", () => {
    grid.removeCol();
});

gridInteraction.emitter.on("dl_map", () => {
    const rndmName = "map_" + Date.now() + Math.random();
    mapDownloader.downloadMap(map, rndmName);
});

paletteInteraction.emitter.on("palette_assets_received", async (files) => {
    const assets = await palette.loadAssets(files);
    project = new Project(assets.projectID);
    palette.buildFrom(assets.res, assets.rootDir, assets.fullPath);
});

paletteInteraction.emitter.on("palette_asset_change", ({ detail }) => {
    palette.selectAsset(detail.asset);
    palette.styleSelectedCell(detail.target);
    gameObjectList.resetSelection();
});

paletteInteraction.emitter.on("palette_directory_back", () => {
    const assets = palette.getAssets();
    const dirInfo = palette.getDirInfo();
    if (project.getID() !== dirInfo.prevDir.slice(0, -1)) {
        palette.buildFrom(assets, dirInfo.prevDir, dirInfo.absCurPath, true);
    }
});

paletteInteraction.emitter.on("palette_context_toggle", ({ detail }) => {
    contextMenu.toggle("paletteContextMenu", detail.coord, detail.asset);
});

contextMenu.emitter.on("new_game_object", ({ detail }) => {
    const asset = _assets.getByID(detail.id);
    gameObjectList.addGameObject(asset);
});

contextMenu.emitter.on("remove_game_object", ({ detail }) => {
    gameObjectList.removeObject(detail.getID());
});

gameObjectListInteraction.emitter.on("game_object_click", ({ detail }) => {
    gameObjectList.selectObject(detail.object);
    gameObjectList.styleDomNode(detail.target);
    palette.resetSelection();
});

gameObjectListInteraction.emitter.on("game_object_context_toggle", ({ detail }) => {
    contextMenu.toggle("gameObjectContextMenu", detail.coord, detail.object);
});

fetch("http://localhost:5000/getAssets")
    .then((res) => {
        return res.json();
    })
    .then(async (assets) => {
        await _assets.createCollection(assets);
        project = new Project(assets.projectID);
        palette.buildFrom(assets.res, assets.rootDir, assets.fullPath);
    });

document.addEventListener("click", (e) => {
    e.preventDefault();
    contextMenu.toggleAllOff();
});
/*
document.addEventListener('drop', function(e) {
    e.stopPropagation()
    e.preventDefault();
    console.log(e)
})*/

// top level handler

function handle_Grid_Left_Click_Drawing(coord) {
    let objToDraw = null;
    if (palette.isAnAssetSelected()) {
        const assetID = palette.getCurrentAssetID();
        const asset = _assets.getByID(assetID);
        const cell = grid.getCellByCursor(coord);

        if (cell.isProp()) {
            const cellAssetID = cell.getObject().obj.getAsset().getID();
            if (cellAssetID === assetID) {
                return;
            } else {
                const id = cell.getObject().obj.getID();
                sceneObjectList.removeSceneObject(id);
            }
        }
        const prop = sceneObjectList.addSceneObject(coord, asset);
        objToDraw = { obj: prop, type: "sceneObject" };
    } else if (gameObjectList.isAnObjectSelected()) {
        const objectID = gameObjectList.getCurrentObjectID();
        const prop = gameObjectList.addGameObjectToScene(coord, objectID);
        if (prop) {
            objToDraw = { obj: prop, type: "gameObject" };
        }
    }
    if (!objToDraw) return;

    grid.addCellByCursor(coord, objToDraw);
}

function hanlde_Grid_Right_Click_Drawing(coord) {
    const cell = grid.getCellByCursor(coord);
    const isProp = cell.isProp();
    if (isProp) {
        const prop = cell.getObject();
        if (prop.type === "gameObject") {
            gameObjectList.removeShowGameObject(prop.obj.getUniqID());
        } else {
            sceneObjectList.removeSceneObject(prop.obj.getID());
        }
        cell.reset();
        grid.removeCellByCursor(coord); // visually removes the sprite;
    }
}
