import { Cell } from "./Cell.js";
import { GridNormalization } from "./GridNormalization.js";
import * as _H from "../../lib/helpers.js";
import { _G } from "../../lib/globals.js";
import { getCanvas, getContext } from "../general/canvasRef.js";
import GridProps from "../grid/GridProps.js";
import sceneBuffer from "../sceneObjects/SceneBuffer.js";
import gameObjectBuffer from "../gameObjects/GameObjectBuffer.js";
import camera from "../Camera/Camera.js";

export const gridProps = new GridProps();

const gridNormal = new GridNormalization();

const canvas = getCanvas();
const ctx = getContext();
_H.spy(camera, "setScale", () => renderGrid()); // spy for the methods calls of either "increaseZoom" or "decreaseZoom" in camera and exec cb

export class Grid {
    constructor() {
        this.colliderW = 3;
        this.cellFillStyle = "black";
    }

    getCellByID(id) {
        return gridProps
            .getTiles()
            .flat()
            .find((el) => el.id === id);
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
        gameObjectBuffer.setBuffer();
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

    addCellByCursor(cursorPos, object, bufferType) {
        const asset = object.obj.asset;
        const blockSize = gridProps.getBlockSize();
        const gridTiles = gridProps.getTiles(); // no cellToRender because 1 sprite can be > viewport
        const tw = camera.toWorld.bind(camera);
        const ts = camera.toScreen.bind(camera);
        const camCoords = camera.getCoords();

        const maxX = tw(cursorPos.x + ts(asset.width)) - camCoords.x;
        const restX = _H.posOr0(-(gridProps.getWidth() - maxX));
        const maxY = tw(cursorPos.y + ts(asset.height)) - camCoords.y;
        const restY = _H.posOr0(-(gridProps.getHeight() - maxY));

       const concernedCells = [];
        for (let x = cursorPos.x; x < ts(maxX - restX + camCoords.x); x += ts(blockSize)) {
            for (let y = cursorPos.y; y < ts(maxY - restY + camCoords.y); y += ts(blockSize)) {
                const floored = this.floorMouse({ x, y });
                const cell = gridTiles[floored.x / blockSize][floored.y / blockSize];
                concernedCells.push(cell.getID());
                const slice = { x: tw(x - cursorPos.x), y: tw(y - cursorPos.y) };
                if (bufferType === "scene") {
                    sceneBuffer.updateBuffer(cell, object, slice);
                } else if (bufferType === "gameObject") {
                    gameObjectBuffer.updateBuffer(cell, object, slice);
                }
            }
        }
        console.log(object)
        object.obj.setCells(concernedCells);
        renderGrid();
    }

    removeCellByCoord(cursorPos, bufferType) {
        const cell = this.getCellByCursor(cursorPos);
        if (!cell) return;
        cell.clearBufferCell(bufferType);
        renderGrid();
    }

    removeCellByID(id, bufferType) {
        const cell = this.getCellByID(id);
        if (!cell) return;
        cell.clearBufferCell(bufferType);
        renderGrid();
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
        sceneBuffer.addSizeUnitToBuffer(side);
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
        sceneBuffer.addSizeUnitToBuffer(side);
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
        sceneBuffer.removeSizeUnitToBuffer(side);
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
        gridProps.removeSizeUnitToBuffer(side);
        renderGrid();
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
    camera.setCellsToRender(gridProps.getTiles());
    const tw = camera.toWorld.bind(camera);
    const { vpWidth, vpHeight } = camera.getViewPort();
    ctx.clear(true);

    const sceneBufferCanvas = sceneBuffer.getBuffer();
    const gameObjectBufferCanvas = gameObjectBuffer.getBuffer();
    const camCoords = camera.getCoords();
    ctx.imageSmoothingEnabled = false;
    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(sceneBufferCanvas, -camCoords.x, -camCoords.y, tw(vpWidth), tw(vpHeight), 0, 0, vpWidth, vpHeight);
    ctx.drawImage(gameObjectBufferCanvas, -camCoords.x, -camCoords.y, tw(vpWidth), tw(vpHeight), 0, 0, vpWidth, vpHeight);
    createMapBorder();
}

export function fillAllCells(cellsToRender) {
    cellsToRender.forEach((cellObj) => {
        if (cellObj.isProp()) {
            cellObj.fillCell();
        }
    });
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
