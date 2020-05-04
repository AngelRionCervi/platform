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
_H.spy(camera, "setScale", scale); // spy for the methods calls of either "increaseZoom" or "decreaseZoom" in camera and exec cb

export class Grid {
    constructor() {
        this.colliderW = 3;
        this.cellFillStyle = "black";
    }

    init() {
        const blockSize = gridProps.getBlockSize();
        const width = gridProps.getWidth();
        const height = gridProps.getHeight();
        let coords = new Array(Math.round(width / blockSize));

        for (let u = 0; u < coords.length; u++) {
            coords[u] = new Array(Math.round(height / blockSize));
        }
        let idStart = 0;
        for (let x = 0; x < width / blockSize; x++) {
            for (let y = 0; y < height / blockSize; y++) {
                const id = x + y + idStart;
                const cellObj = new Cell(id, x * blockSize, y * blockSize, x, y, "air", null);
                coords[x][y] = cellObj;
            }
            const minSide = Math.min(width, height);
            idStart += minSide - 1;
        }
        gridProps.setCoords(coords);
        canvas.width = _G.viewPortWidth;
        canvas.height = _G.viewPortHeight;
    }

    getCellByCursor(cursorPos) {
        const blockSize = gridProps.getBlockSize();
        const x = _H.roundToPrevMult(Math.round(cursorPos.x - camera.x), blockSize);
        const y = _H.roundToPrevMult(Math.round(cursorPos.y - camera.y), blockSize);
        const flatCoord = camera.getCellsToRender(gridProps.getCoords()).flat();
        const targetCell = flatCoord.find((n) => n.x === x && n.y === y);
        return targetCell;
    }

    debugTargetCell(targetCell) {
        ctx.fillStyle = "red";
        ctx.fillRect(targetCell.x, targetCell.y, _G.blockSize, _G.blockSize);
    }

    addCellByCursor(cursorPos, object) {
        const cell = this.getCellByCursor(cursorPos);
        cell.setBlockType("wall").setObject(object).fillCell();
    }

    removeCellByCursor(cursorPos) {
        const cell = this.getCellByCursor(cursorPos);
        cell.setBlockType("air").fillCell();
    }

    addCol(side) {
        const blockSize = gridProps.getBlockSize();
        gridProps.setWidth(gridProps.getWidth() + blockSize);
        const newCol = [];

        if (side === "right") {
            let id = gridProps.getCoords().flat().pop().id;

            for (let y = 0; y < gridProps.getHeight() / blockSize; y++) {
                id++;
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
            let id = gridProps.getCoords().flat().shift().id;

            for (let y = 0; y < gridProps.getHeight() / blockSize; y++) {
                id--;
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

        const coords = gridProps.getCoords();

        if (side === "bottom") {
            for (let x = 0; x < gridProps.getWidth() / blockSize; x++) {
                const cellObj = new Cell(
                    coords[x][coords[x].length - 1].id + "_",
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
                const cellObj = new Cell(coords[x][0].id + "-", x * blockSize, 0, x, 0, "air", null);
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
    const cameraCoords = camera.getCoords();
    const viewPort = camera.getViewPort();
    const gridWidth = gridProps.getWidth();
    const gridHeight = gridProps.getHeight();
    const borderWidth = _G.mapBorderWidth;

    ctx.fillStyle = _G.mapBordersColor;
    if (cameraCoords.x >= 0) {
        ctx.fillRect(
            cameraCoords.x - borderWidth,
            cameraCoords.y - borderWidth,
            borderWidth,
            gridHeight + borderWidth * 2
        );
    }
    if (-cameraCoords.x + viewPort.width >= gridWidth) {
        ctx.fillRect(
            gridWidth + cameraCoords.x,
            cameraCoords.y - borderWidth,
            borderWidth,
            gridHeight + borderWidth * 2
        );
    }
    if (cameraCoords.y >= 0) {
        ctx.fillRect(cameraCoords.x, cameraCoords.y - borderWidth, gridWidth, borderWidth);
    }
    if (-cameraCoords.y + viewPort.height >= gridHeight) {
        ctx.fillRect(cameraCoords.x, gridHeight + cameraCoords.y, gridWidth, borderWidth);
    }
}

function scale({ curPos }) {
    const scale = camera.getScale();

    //ctx.translate(curPos.x, curPos.y);
    ctx.scale(scale, scale);
    //ctx.translate(-curPos.x, -curPos.y);
    renderGrid();
}

export function renderGrid() {
    const cells = camera.getCellsToRender(gridProps.getCoords());
    console.log("cell rendered : ", cells.length);
    ctx.clear(true);
    fillAllCells(cells);
    createMapBorder();
}

export function fillAllCells(cellsToRender) {
    cellsToRender.flat().forEach((cellObj) => {
        cellObj.fillCell();
    });
}
