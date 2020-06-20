import { Cell } from "./Cell.js";
import { GridNormalization } from "./GridNormalization.js";
import * as _H from "../../lib/helpers.js";
import { _G } from "../general/globals.js";
import { getCanvas, getContext } from "../general/canvasRef.js";
import GridProps from "./GridProps.js";
import camera from "../Camera/Camera.js";
import { sceneBuffer, gameObjectBufferList, changeBufferSize } from "../general/CanvasBuffer.js";
import itemSelection from "../general/itemSelection.js";

const gridNormal = new GridNormalization();
export const gridProps = new GridProps();

const canvas = getCanvas();
const ctx = getContext();
_H.spy(camera, "setScale", () => renderGrid()); // spy for the methods calls of either "increaseZoom" or "decreaseZoom" in camera and exec cb

export class Grid {
    constructor() {
        this.colliderW = 3;
        this.cellFillStyle = "black";
        this.dragging = false;
        this.startDragCoord = null;
        this.objDragOrigins = null;
    }

    init() {
        const blockSize = gridProps.getBlockSize();
        const width = gridProps.getWidth();
        const height = gridProps.getHeight();
        let tileCollection = new Array(Math.round(width / blockSize));

        for (let u = 0; u < tileCollection.length; u++) {
            tileCollection[u] = new Array(Math.round(height / blockSize));
        }

        for (let x = 0; x < width / blockSize; x++) {
            for (let y = 0; y < height / blockSize; y++) {
                const id = _H.uniqid();
                const cellObj = new Cell(id, x * blockSize, y * blockSize, x, y, "air", null);
                tileCollection[x][y] = cellObj;
            }
        }
        gridProps.setTiles(tileCollection);
        canvas.width = _G.viewPortWidth;
        canvas.height = _G.viewPortHeight;
        sceneBuffer.setBuffer();
    }

    floorMouse(coords) {
        const blockSize = gridProps.getBlockSize();
        const zoom = camera.getZoom();
        const x = _H.roundToPrevMult(Math.round(coords.x / zoom - camera.x), blockSize);
        const y = _H.roundToPrevMult(Math.round(coords.y / zoom - camera.y), blockSize);
        return { x, y };
    }

    getCellByCursor(cursorPos, coords = null) {
        const { x, y } = this.floorMouse(cursorPos);
        if (coords) {
            const targetCell = coords.find((n) => n.x === x && n.y === y);
            return targetCell;
        }
        const flatCoord = gridProps.getRenderedCells().flat();
        const targetCell = flatCoord.find((n) => n.x === x && n.y === y);
        return targetCell;
    }

    getAddObjectLoopProps(cursorPos, asset) {
        const blockSize = gridProps.getBlockSize();
        const gridTiles = gridProps.getTiles(); // no cellToRender because 1 sprite can be > viewport
        const tw = camera.toWorld.bind(camera);
        const ts = camera.toScreen.bind(camera);
        const camCoords = camera.getCoords();

        const adjWidth = _H.roundToNearestMult(asset.width, blockSize);
        const adjHeight = _H.roundToNearestMult(asset.height, blockSize);
        const sampleWidth = adjWidth / blockSize;
        const sampleHeight = adjHeight / blockSize;

        const maxX = tw(cursorPos.x + ts(adjWidth)) - camCoords.x;
        const restX = _H.posOr0(-(gridProps.getWidth() - maxX));
        const maxY = tw(cursorPos.y + ts(adjHeight)) - camCoords.y;
        const restY = _H.posOr0(-(gridProps.getHeight() - maxY));

        const floorCursor = this.floorMouse(cursorPos);

        return {
            blockSize,
            gridTiles,
            tw,
            ts,
            camCoords,
            maxX,
            restX,
            maxY,
            restY,
            floorCursor,
            sampleWidth,
            sampleHeight,
        };
    }

    setSceneObject(cellOrCursor, asset, addSceneObjectToList, removeSceneObjectOfList, slice = null) {
        const gridTiles = gridProps.getTiles();
        const blockSize = gridProps.getBlockSize();
        const clickedCell = cellOrCursor instanceof Cell ? cellOrCursor : this.getCellByCursor(cellOrCursor);

        sceneBuffer.updateBuffer2({ x: clickedCell.x, y: clickedCell.y }, asset, slice, "sceneObject");

        for (let x = clickedCell.absX; x < asset.trueWidth / blockSize + clickedCell.absX; x++) {
            const sliceX = x * blockSize;
            for (let y = clickedCell.absY; y < asset.trueHeight / blockSize + clickedCell.absY; y++) {
                if (!gridTiles?.[x]?.[y]) continue; // à optimiser
                const sliceY = y * blockSize;
                const slice = {
                    x: sliceX,
                    y: sliceY,
                    absX: sliceX - clickedCell.x,
                    absY: sliceY - clickedCell.y,
                };
                const cell = gridTiles[x][y];
                if (cell.isProp()) {
                    removeSceneObjectOfList(cell.getProp().getID());
                }
                cell.setProp(addSceneObjectToList({ x: sliceX, y: sliceY }, asset, slice));
            }
        }
        return this;
    }

    setSceneObjectOnUniqCell(cellOrCursor, asset, addSceneObjectToList, removeSceneObjectOfList, slice = null) {
        const clickedCell = cellOrCursor instanceof Cell ? cellOrCursor : this.getCellByCursor(cellOrCursor);
        if (clickedCell.isProp()) {
            removeSceneObjectOfList(clickedCell.getProp().getID());
        }
        sceneBuffer.updateBuffer2({ x: clickedCell.x, y: clickedCell.y }, asset, slice, "sceneObject");
        clickedCell.setProp(addSceneObjectToList({ x: clickedCell.x, y: clickedCell.y }, asset));
        return this;
    }

    setGameObject(cursorPos, objectID, addGameObjectToList) {
        const prop = addGameObjectToList(cursorPos, objectID);
        if (!prop) return;

        const {
            blockSize,
            gridTiles,
            tw,
            ts,
            camCoords,
            maxX,
            restX,
            maxY,
            restY,
            floorCursor,
        } = this.getAddObjectLoopProps(cursorPos, prop.asset);

        /*const concernedCells = [];
        
        for (let x = cursorPos.x; x < ts(maxX - restX + camCoords.x); x += ts(blockSize)) {
            for (let y = cursorPos.y; y < ts(maxY - restY + camCoords.y); y += ts(blockSize)) {
                const floored = this.floorMouse({ x, y });
                const cell = gridTiles[floored.x / blockSize][floored.y / blockSize];
                concernedCells.push(cell.getID());
                const slice = { x: tw(x - cursorPos.x), y: tw(y - cursorPos.y) };
                sceneBuffer.updateBuffer(cell, prop, slice, "gameObject");
            }
        }
        prop.setCells(concernedCells);*/

        gameObjectBufferList.add(prop, { x: floorCursor.x, y: floorCursor.y });
        return this;
    }

    floodFill(cursorPos, asset, addSceneObjectToList, removeSceneObjectOfList) { // 2 freaking days
        const targetCell = this.getCellByCursor(cursorPos);
        const tiles = gridProps.getTiles();
        const blockSize = gridProps.getBlockSize();
        const targetAsset = targetCell.prop ? targetCell.prop.asset.name : null;
        console.log(tiles)
        if (targetAsset !== asset.name) {
            const cellsToCheck = [
                {
                    tile: targetCell,
                    slice: { sx: 0, sy: 0, x: targetCell.absX * blockSize, y: targetCell.absY * blockSize },
                },
            ];
            while (cellsToCheck.length > 0) {
                const lastObj = cellsToCheck.shift();
                const lastCell = lastObj.tile;
                const oldSlice = lastObj.slice;
                const lastCellProp = lastCell.isProp() ? lastCell.prop.asset.name : null;

                if (targetAsset === lastCellProp) {
                    this.setSceneObjectOnUniqCell(lastCell, asset, addSceneObjectToList, removeSceneObjectOfList, oldSlice);

                    if (tiles[lastCell.absX + 1]) {
                        let sx = oldSlice.sx + blockSize;
                        if (sx >= asset.trueWidth) sx = 0;
                        const newSlice = {
                            sx,
                            sy: oldSlice.sy,
                            x: oldSlice.x + blockSize,
                            y: oldSlice.y,
                        };
                        cellsToCheck.push({ tile: tiles[lastCell.absX + 1][lastCell.absY], slice: newSlice });
                    }
                    if (tiles[lastCell.absX - 1]) {
                        let sx = oldSlice.sx - blockSize;
                        if (sx <= 0) sx = asset.trueWidth - blockSize;
                        const newSlice = {
                            sx,
                            sy: oldSlice.sy,
                            x: oldSlice.x - blockSize,
                            y: oldSlice.y,
                        };
                        cellsToCheck.push({ tile: tiles[lastCell.absX - 1][lastCell.absY], slice: newSlice });
                    }
                    if (tiles[lastCell.absX][lastCell.absY + 1]) {
                        let sy = oldSlice.sy + blockSize;
                        if (sy >= asset.trueHeight) sy = 0;
                        const newSlice = {
                            sx: oldSlice.sx,
                            sy,
                            x: oldSlice.x,
                            y: oldSlice.y + blockSize,
                        };
                        cellsToCheck.push({ tile: tiles[lastCell.absX][lastCell.absY + 1], slice: newSlice });
                    }
                    if (tiles[lastCell.absX][lastCell.absY - 1]) {
                        let sy = oldSlice.sy - blockSize;
                        if (sy <= 0) sy = asset.trueHeight - blockSize;
                        const newSlice = {
                            sx: oldSlice.sx,
                            sy,
                            x: oldSlice.x,
                            y: oldSlice.y - blockSize,
                        };
                        cellsToCheck.push({ tile: tiles[lastCell.absX][lastCell.absY - 1], slice: newSlice });
                    }
                }
            }
        }
    }

    removeCellByCoord(cursorPos) {
        const cell = this.getCellByCursor(cursorPos);
        sceneBuffer.clearTile({ x: cell.x, y: cell.y }, gridProps.getBlockSize());
        cell.removeProp();
    }

    removeCellByID(id) {
        const cell = this.getCellByID(id);
        if (!cell) return;
        cell.clearBufferCell(true);
    }

    removeGameObject(buffer) {
        gameObjectBufferList.remove(buffer.id);
    }

    addCol(side) {
        const blockSize = gridProps.getBlockSize();
        gridProps.setWidth(gridProps.getWidth() + blockSize);
        const newCol = [];

        if (side === "right") {
            for (let y = 0; y < gridProps.getHeight() / blockSize; y++) {
                const id = _H.uniqid();
                const cellObj = new Cell(
                    id,
                    gridProps.getWidth() - blockSize,
                    y * blockSize,
                    gridProps.getWidth() / blockSize - 1,
                    y,
                    "air",
                    null
                );
                newCol.push(cellObj);
            }

            gridProps.newColRight(newCol);
        } else if (side === "left") {
            for (let y = 0; y < gridProps.getHeight() / blockSize; y++) {
                const id = _H.uniqid();
                const cellObj = new Cell(id, 0, y * blockSize, 0, y, "air", null);
                newCol.push(cellObj);
            }

            gridProps.moveAllRight(1).newColLeft(newCol);
            camera.moveRight(blockSize);
        }
        changeBufferSize(side, "add");
        renderGrid();
    }

    addRow(side) {
        const blockSize = gridProps.getBlockSize();
        gridProps.setHeight(gridProps.getHeight() + blockSize);
        const newRow = [];

        if (side === "bottom") {
            for (let x = 0; x < gridProps.getWidth() / blockSize; x++) {
                const id = _H.uniqid();
                const cellObj = new Cell(
                    id,
                    x * blockSize,
                    gridProps.getHeight() - blockSize,
                    x,
                    gridProps.getHeight() / blockSize - 1,
                    "air",
                    null
                );
                newRow.push(cellObj);
            }
            gridProps.newRowBottom(newRow);
        } else if (side === "top") {
            for (let x = 0; x < gridProps.getWidth() / blockSize; x++) {
                const id = _H.uniqid();
                const cellObj = new Cell(id, x * blockSize, 0, x, 0, "air", null);
                newRow.push(cellObj);
            }
            gridProps.moveAllDown(1).newRowTop(newRow);
            camera.moveBottom(blockSize);
        }
        changeBufferSize(side, "add");
        renderGrid();
    }

    removeCol(side) {
        const blockSize = gridProps.getBlockSize();
        gridProps.setWidth(gridProps.getWidth() - blockSize);
        if (side === "right") {
            gridProps.removeColRight();
        } else if (side === "left") {
            gridProps.removeColLeft().moveAllLeft(1);
            camera.moveLeft(blockSize);
        }
        changeBufferSize(side, "remove");
        renderGrid();
    }

    removeRow(side) {
        const blockSize = gridProps.getBlockSize();
        gridProps.setHeight(gridProps.getHeight() - blockSize);
        if (side === "bottom") {
            gridProps.removeRowBottom();
        } else if (side === "top") {
            gridProps.removeRowTop().moveAllUp(1);
            camera.moveTop(blockSize);
        }
        changeBufferSize(side, "remove");
        renderGrid();
    }

    isDragging() {
        return this.dragging;
    }

    startDragging(coord, selectedIDs) {
        this.dragging = true;
        this.startDragCoord = coord;
        const gameObjects = gameObjectBufferList.getObjectsBuffer(selectedIDs);
        this.objDragOrigins = JSON.parse(JSON.stringify(gameObjects.map((el) => el.coord)));
    }

    stopDragging() {
        if (!this.dragging) return;
        this.dragging = false;
        this.startDragCoord = null;
        this.objDragOrigins = null;
    }

    drag(cursorPos, selectedIDs) {
        if (!this.dragging || !this.objDragOrigins || !this.startDragCoord) return;
        const gameObjects = gameObjectBufferList.getObjectsBuffer(selectedIDs);
        const tw = camera.toWorld.bind(camera);

        gameObjects.forEach((go, index) => {
            const nX = this.objDragOrigins[index].x - tw(this.startDragCoord.x) + tw(cursorPos.x);
            const nY = this.objDragOrigins[index].y - tw(this.startDragCoord.y) + tw(cursorPos.y);
            go.coord.x = nX;
            go.coord.y = nY;
        });
    }

    getCellByID(id) {
        return gridProps
            .getTiles()
            .flat()
            .find((el) => el.id === id);
    }

    getMap() {
        const nMap = gridNormal.normalize(gridCoords, this.blockSize, canvas);
        const debugBlocks = this.debugBlocks(nMap);

        return {
            width: gridProps.getWidth(),
            height: gridProps.getHeight(),
            coords: nMap,
            debugColliders: debugBlocks,
        };
    }

    debugBlocks(nMap) {
        console.log("nMap", nMap);

        const colliders = [];

        nMap.forEach((v) => {
            colliders.push([
                { type: "yWall", x: v.x + this.colliderW, y: v.y, w: v.w - this.colliderW, h: this.colliderW }, //top
                {
                    type: "yWall",
                    x: v.x + this.colliderW,
                    y: v.y + v.h - this.colliderW,
                    w: v.w - this.colliderW,
                    h: this.colliderW,
                }, //bottom
                { type: "xWall", x: v.x, y: v.y, w: this.colliderW, h: v.h }, //left
                { type: "xWall", x: v.x + v.w - this.colliderW, y: v.y, w: this.colliderW, h: v.h },
            ]); //right
        });

        return colliders;
    }
}

function createMapBorder() {
    // visual
    const cameraCoords = camera.getCoords();
    const { vpWidth, vpHeight } = camera.getViewPort();
    const gridWidth = gridProps.getWidth();
    const gridHeight = gridProps.getHeight();
    const borderWidth = _G.mapBorderWidth;
    const ts = camera.toScreen.bind(camera);
    const tw = camera.toWorld.bind(camera);

    ctx.fillStyle = _G.mapBordersColor;
    if (cameraCoords.x >= 0) {
        // left
        ctx.fillRect(
            ts(cameraCoords.x - borderWidth),
            ts(cameraCoords.y - borderWidth),
            borderWidth,
            ts(gridHeight + borderWidth) + borderWidth
        );
    }
    if (-cameraCoords.x + tw(vpWidth) >= gridWidth) {
        //right
        ctx.fillRect(
            ts(cameraCoords.x + gridWidth),
            ts(cameraCoords.y - borderWidth),
            borderWidth,
            ts(gridHeight + borderWidth) + borderWidth
        );
    }
    if (cameraCoords.y >= 0) {
        // top
        ctx.fillRect(
            ts(cameraCoords.x - borderWidth),
            ts(cameraCoords.y - borderWidth),
            ts(gridWidth + borderWidth) + borderWidth,
            borderWidth
        );
    }
    if (-cameraCoords.y + tw(vpHeight) >= gridHeight) {
        // bottom
        ctx.fillRect(
            ts(cameraCoords.x - borderWidth),
            ts(cameraCoords.y + gridHeight),
            ts(gridWidth + borderWidth) + borderWidth,
            borderWidth
        );
    }
}

export function renderGrid() {
    camera.setCellsToInteract(gridProps.getTiles());
    const tw = camera.toWorld.bind(camera);
    const { vpWidth, vpHeight } = camera.getViewPort();
    ctx.clear(true);

    gameObjectBufferList.update();

    const sceneBufferCanvas = sceneBuffer.getBuffer();
    const gameObjectBufferCanvas = gameObjectBufferList.getMainBuffer();
    const camCoords = camera.getCoords();

    ctx.imageSmoothingEnabled = false;
    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(sceneBufferCanvas, -camCoords.x, -camCoords.y, tw(vpWidth), tw(vpHeight), 0, 0, vpWidth, vpHeight);
    ctx.drawImage(
        gameObjectBufferCanvas,
        -camCoords.x,
        -camCoords.y,
        tw(vpWidth),
        tw(vpHeight),
        0,
        0,
        vpWidth,
        vpHeight
    );
    createMapBorder();
    itemSelection.create();
}

export function fillAllCells(cellsToRender) {
    cellsToRender.forEach((cellObj) => {
        if (cellObj.isProp()) {
            cellObj.fillCell();
        }
    });
}

function debugCell(x, y) {
    setTimeout(() => {
        ctx.fillStyle = "red";
        const ts = camera.toScreen.bind(camera);
        const blockSize = gridProps.getBlockSize();
        ctx.fillRect(ts(x), ts(y), ts(blockSize), ts(blockSize));
    }, 0);
}

function debugRenderedCells(cells) {
    // gap closing between cells
    const zoom = camera.getZoom();
    const bs = gridProps.getBlockSize();
    const trueBS = Math.floor(bs * zoom);
    let lastX;
    let col = -1;
    const newGrid = [];
    for (const cell of cells) {
        if (cell.x !== lastX) {
            lastX = cell.x;
            newGrid.push([]);
            col++;
        }
        newGrid[col].push(cell);
    }
    newGrid.forEach((col, colIndex, grid) => {
        if (colIndex > 0) {
            col.map((cell) => {
                cell.addedBlockW = Math.abs(grid[colIndex][0].tx() - grid[colIndex - 1][0].tx()) - trueBS;
            });
        }
        col.forEach((cell, cellY, colArr) => {
            if (cellY > 0) {
                cell.addedBlockH = Math.abs(colArr[cellY].ty() - colArr[cellY - 1].ty()) - trueBS;
            }
        });
    });
    return newGrid.flat();
}
