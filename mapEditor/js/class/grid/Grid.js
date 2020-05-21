import { Cell } from "./Cell.js";
import { GridNormalization } from "./GridNormalization.js";
import * as _H from "../../lib/helpers.js";
import { _G } from "../../lib/globals.js";
import Camera from "./Camera.js";
import { getCanvas, getContext } from "../general/canvasRef.js";

export class GridProps {
    constructor() {
        this.gridWidth = _G.gridWidth;
        this.gridHeight = _G.gridHeight;
        this.blockSize = _G.blockSize;
        this.gridCoords = [];
    }

    getBlockSize() {
        return this.blockSize;
    }
    setBlockSize(size) {
        this.blockSize = size;
        return this;
    }
    setWidth(width) {
        this.gridWidth = width;
        return this;
    }
    setHeight(height) {
        this.gridHeight = height;
        return this;
    }
    getWidth() {
        return this.gridWidth;
    }
    getHeight() {
        return this.gridHeight;
    }
    setCoords(gridCoords) {
        this.gridCoords = gridCoords;
        return this;
    }
    getCoords() {
        return this.gridCoords;
    }
    setRenderedCells(renderedCells) {
        this.renderedCells = renderedCells;
    }
    getRenderedCells() {
        return this.renderedCells;
    }
    newColRight(newCol) {
        this.gridCoords.push(newCol);
        return this;
    }
    newColLeft(newCol) {
        this.gridCoords.unshift(newCol);
        return this;
    }
    removeColRight() {
        this.gridCoords.pop();
        return this;
    }
    removeColLeft() {
        this.gridCoords.shift();
        return this;
    }
    newRowBottom(row) {
        this.gridCoords.forEach((col, i) => {
            col.push(row[i]);
        });
        return this;
    }
    newRowTop(row) {
        this.gridCoords.forEach((col, i) => {
            col.unshift(row[i]);
        });
        return this;
    }
    removeRowBottom() {
        this.gridCoords.forEach((col) => {
            col.pop();
        });
        return this;
    }
    removeRowTop() {
        this.gridCoords.forEach((col) => {
            col.shift();
        });
        return this;
    }
    moveAllRight(times) {
        this.gridCoords.flat().forEach((cell) => {
            cell.moveRight(times);
        });
        return this;
    }
    moveAllLeft(times) {
        this.gridCoords.flat().forEach((cell) => {
            cell.moveLeft(times);
        });
        return this;
    }
    moveAllDown(times) {
        this.gridCoords.flat().forEach((cell) => {
            cell.moveDown(times);
        });
        return this;
    }
    moveAllUp(times) {
        this.gridCoords.flat().forEach((cell) => {
            cell.moveUp(times);
        });
        return this;
    }
}

export const gridProps = new GridProps();
export const camera = new Camera();

const gridNormal = new GridNormalization();

const canvas = getCanvas();
const ctx = getContext();
_H.spy(camera, "setScale", renderGrid); // spy for the methods calls of either "increaseZoom" or "decreaseZoom" in camera and exec cb

export class Grid {
    constructor() {
        this.colliderW = 3;
        this.cellFillStyle = "black";
    }

    getCellByID(id) {
        return gridProps
            .getRenderedCells()
            .flat()
            .find((el) => el.id === id);
    }

    init() {
        const blockSize = gridProps.getBlockSize();
        const width = gridProps.getWidth();
        const height = gridProps.getHeight();
        let coords = new Array(Math.round(width / blockSize));

        for (let u = 0; u < coords.length; u++) {
            coords[u] = new Array(Math.round(height / blockSize));
        }

        for (let x = 0; x < width / blockSize; x++) {
            for (let y = 0; y < height / blockSize; y++) {
                const id = _H.uniqid();
                const cellObj = new Cell(id, x * blockSize, y * blockSize, x, y, "air", null);
                coords[x][y] = cellObj;
            }
        }
        gridProps.setCoords(coords);
        canvas.width = _G.viewPortWidth;
        canvas.height = _G.viewPortHeight;
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

    debugTargetCell(targetCell) {
        ctx.fillStyle = "red";
        //ctx.fillRect(targetCell.x, targetCell.y, _G.blockSize, _G.blockSize);
    }

    addCellByCursor(cursorPos, object) {
        const asset = object.obj.asset;
        const blockSize = gridProps.getBlockSize();
        const gridCoords = gridProps.getCoords(); // no cellToRender because 1 sprite can be > viewport
        const tw = camera.toWorld.bind(camera);
        const ts = camera.toScreen.bind(camera);

        const concernedCells = [];
        for (let x = cursorPos.x; x < cursorPos.x + ts(asset.width); x += ts(blockSize)) {
            for (let y = cursorPos.y; y < cursorPos.y + ts(asset.height); y += ts(blockSize)) {
                const floored = this.floorMouse({ x, y });
                const cell = gridCoords[floored.x / blockSize][floored.y / blockSize] || false;
                if (!cell) break;
                concernedCells.push(cell.getID());
                const slice = { x: Math.round(tw(x - cursorPos.x)), y: Math.round(tw(y - cursorPos.y)) };
                cell.setBlockType("wall").setProp(object).setSlice(slice).fillCell();
            }
        }
        console.log("concernedCells", concernedCells.length);
        //object.obj.setCells(concernedCells);
    }

    removeCellByCoord(cursorPos) {
        const cell = this.getCellByCursor(cursorPos);
        if (!cell) return;
        cell.reset();
        cell.setBlockType("air").fillCell();
    }

    removeCellByID(id) {
        const cell = this.getCellByID(id);
        if (!cell) return;
        cell.reset();
        cell.setBlockType("air").fillCell();
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
    const viewPort = camera.getViewPort();
    const zoom = camera.getZoom();
    const gridWidth = gridProps.getWidth();
    const gridHeight = gridProps.getHeight();
    const borderWidth = _G.mapBorderWidth;
    const ts = camera.toScreen.bind(camera);

    ctx.fillStyle = _G.mapBordersColor;
    if (cameraCoords.x >= 0) {
        // left
        ctx.fillRect(
            ts(cameraCoords.x) - ts(borderWidth),
            ts(cameraCoords.y) - ts(borderWidth),
            ts(borderWidth),
            ts(gridHeight) + ts(borderWidth) * 2
        );
    }
    if (-cameraCoords.x + viewPort.width / zoom >= gridWidth) {
        //right
        ctx.fillRect(
            ts(cameraCoords.x) + ts(gridWidth),
            ts(cameraCoords.y) - ts(borderWidth),
            ts(borderWidth),
            ts(gridHeight) + ts(borderWidth) * 2
        );
    }
    if (cameraCoords.y >= 0) {
        // top
        ctx.fillRect(ts(cameraCoords.x), ts(cameraCoords.y) - ts(borderWidth), ts(gridWidth), ts(borderWidth));
    }
    if (-cameraCoords.y + viewPort.height / zoom >= gridHeight) {
        // bottom
        ctx.fillRect(ts(cameraCoords.x), ts(cameraCoords.y) + ts(gridHeight), ts(gridWidth), ts(borderWidth));
    }
}

export function renderGrid() {
    const cells = camera.getCellsToRender(gridProps.getCoords());
    console.log("cell rendered : ", cells.length);
    //const debugCells = debugRenderedCells(cells);
    ctx.clear(true);
    fillAllCells(cells);
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
