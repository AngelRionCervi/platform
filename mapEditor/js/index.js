const canvas = document.getElementById("mapEditorCanvas");
const ctx = canvas.getContext("2d");

import editor from "./class/editor/Editor.js";
import tools from "./class/tools/Tools.js";
import { ContextMenu } from "./class/general/ContextMenu.js";
import { Keyboard } from "./class/keyboardHandling/Keyboard.js";
import { Project } from "./class/project/userProject.js";
import { GridInteraction } from "./class/editor/GridInteraction.js";
import { Grid, renderGrid } from "./class/editor/Grid.js";
import camera from "./class/Camera/Camera.js";
import { Assets } from "./class/project/Assets.js";
import { MapDownloader } from "./class/download/MapDownloader.js";
import { Palette } from "./class/palette/Palette.js";
import { PaletteInteraction } from "./class/palette/PaletteInteraction.js";
import { SceneObjectList } from "./class/sceneObjects/SceneObjectList.js";
import { SceneObjectListInteraction } from "./class/sceneObjects/SceneObjectListInteraction.js";
import { GameObjectList } from "./class/gameObjects/GameObjectList.js";
import { GameObjectListInteraction } from "./class/gameObjects/GameObjectListInteraction.js";
import { gameObjectBufferList } from "./class/general/CanvasBuffer.js";
import itemSelection from "./class/general/itemSelection.js";


const gridInteraction = new GridInteraction();
const grid = new Grid();
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
renderGrid();
_keyboard.listen();
paletteInteraction.watchDrop();
paletteInteraction.watchDirectoryBack();

_keyboard.emitter.on("keyboard_input_change", ({ detail }) => {
    keys = detail;
    if (!keys.ctrl) camera.stopPan();
});

gridInteraction.emitter.on("grid_left_click", ({ detail }) => {
    if (keys.ctrl) {
        camera.newPanPoint(detail);
    } else {
        handle_Grid_Left_Click_Drawing(detail);
    }
});

gridInteraction.emitter.on("grid_right_click", ({ detail }) => {
    if (keys.ctrl) {
        return;
    } else {
        handle_Grid_Right_Click_Drawing(detail);
    }
});

gridInteraction.emitter.on("grid_left_move", ({ detail }) => {
    if (keys.ctrl) {
        camera.pan(detail);
    } else {
        handle_Grid_Left_Click_Drawing(detail, true);
    }
});

gridInteraction.emitter.on("grid_right_move", ({ detail }) => {
    if (keys.ctrl) {
        return;
    } else {
        handle_Grid_Right_Click_Drawing(detail, true);
    }
});

gridInteraction.emitter.on("grid_wheel", ({ detail }) => {
    //dir, curPos
    camera.setScale(detail);
});

gridInteraction.emitter.on("add_row", ({ detail }) => {
    grid.addRow(detail);
});

gridInteraction.emitter.on("remove_row", ({ detail }) => {
    grid.removeRow(detail);
});

gridInteraction.emitter.on("add_col", ({ detail }) => {
    grid.addCol(detail);
});

gridInteraction.emitter.on("remove_col", ({ detail }) => {
    grid.removeCol(detail);
});

gridInteraction.emitter.on("grid_left_mouse_up", ({ detail }) => {
    grid.stopDragging();
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

editor.emitter.on("gridResize", ({ detail }) => {
    console.log(detail)
    grid.resizeGrid(detail);
})

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
    //e.preventDefault();
    contextMenu.toggleAllOff();
});

// top level handler

function handle_Grid_Left_Click_Drawing(coord, moving) {
    const gameObjectInst = gameObjectBufferList.getBufferByCoord(coord);

    if (palette.isAnAssetSelected()) {
        const asset = _assets.getByID(palette.getCurrentAssetID());
        if (tools.getSelected() === "bucket") {
            grid.floodFill(
                coord,
                asset,
                sceneObjectList.addSceneObject.bind(sceneObjectList),
                sceneObjectList.removeSceneObject.bind(sceneObjectList)
            );
        } else {
            grid.setSceneObject(
                coord,
                asset,
                sceneObjectList.addSceneObject.bind(sceneObjectList),
                sceneObjectList.removeSceneObject.bind(sceneObjectList)
            );
        }
        
    } else if (gameObjectList.isAnObjectSelected() && !moving) {
        if (gameObjectInst) {
            if (itemSelection.isSelected(gameObjectInst.id) && !_keyboard.act("lShift")) {
                itemSelection.unselect(gameObjectInst.id);
            } else {
                itemSelection.add(gameObjectInst);
            }
            renderGrid();
            return;
        } 
        if (!_keyboard.act("lShift")) {
            itemSelection.unselectAll();
        }

        const objectID = gameObjectList.getCurrentObjectID();
        grid.setGameObject(coord, objectID, gameObjectList.addGameObjectToScene.bind(gameObjectList));
    } else if (gameObjectInst && moving && !grid.isDragging()) {
        console.log("STARTED dragging");
        grid.startDragging(coord, itemSelection.getSelectedIDs());
    } else if (grid.isDragging()) {
        console.log("dragging");
        grid.drag(coord, itemSelection.getSelectedIDs());
    }

    renderGrid();
}

function handle_Grid_Right_Click_Drawing(coord, moving) {
    const cell = grid.getCellByCursor(coord);
    const cellContent = cell.getContent();

    const gameObjectInst = gameObjectBufferList.getBufferByCoord(coord);

    if (gameObjectInst && !moving) {
        if (!itemSelection.isSelected(gameObjectInst.id)) {
            if (!_keyboard.act("lShift")) {
                itemSelection.unselectAll();
            }
            itemSelection.add(gameObjectInst);
        }
    } else {
        //sceneObjectList.removeSceneObject(cellContent.prop.getID());
        grid.removeCellByCoord(coord, "scene");
    }

    renderGrid();
}

const mainLoop = () =>
    setInterval(() => {
        itemSelection.animate();
    }, 1000 / 10);

mainLoop();
