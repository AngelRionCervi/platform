import { Cell } from "./Cell.js";
import { GridNormalization } from "./GridNormalization.js";
import * as plshelp from "../../lib/helpers.js";
import { _GLOBALS_ } from "../../lib/globals.js";

const gridNormal = new GridNormalization();

export class Grid {
    constructor(gridDiv, canvas, ctx) {
        this.gridDiv = gridDiv;
        this.canvas = canvas;
        this.ctx = ctx;
        this.origin = { x: 0, y: 0 };
        this.gridWidth = 1600;
        this.gridHeight = 1024;
        this.viewPortWidth = 1024;
        this.viewPortHeight = 576;
        this.blockSize = _GLOBALS_.blockSize;
        this.colliderW = 3;
        this.gridCoords;
        this.cellFillStyle = "black";
        this.panning = false;

        this.xOffset = 0;
        this.yOffset = 0;
    }

    init() {
        this.gridCoords = new Array(this.gridWidth / this.blockSize);

        for (let u = 0; u < this.gridCoords.length; u++) {
            this.gridCoords[u] = new Array(this.gridHeight / this.blockSize);
        }
        let idStart = 0;
        for (let x = 0; x < this.gridWidth / this.blockSize; x++) {
            for (let y = 0; y < this.gridHeight / this.blockSize; y++) {
                const id = x + y + idStart;
                const cellObj = new Cell(
                    this.ctx,
                    id,
                    x * this.blockSize,
                    y * this.blockSize,
                    x,
                    y,
                    "air",
                    this.blockSize,
                    null
                );
                this.gridCoords[x][y] = cellObj;
            }
            const minSide = Math.min(this.gridWidth, this.gridHeight);
            idStart += minSide - 1;
        }

        this.canvas.width = this.viewPortWidth;
        this.canvas.height = this.viewPortHeight;
    }

    resetCanvas() {
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    getCellToRender() {
        const cellToRender = [];

        for (let x = this.xOffset / this.blockSize; x < this.viewPortWidth / this.blockSize; x++) {
            for (let y = this.yOffset / this.blockSize; y < this.viewPortHeight / this.blockSize; y++) {
                if (x >= -1 && y >= -1) {
                    const gridX = x * this.blockSize - this.xOffset;
                    const gridY = y * this.blockSize - this.yOffset;
                    let n = Math.round(gridX / this.blockSize);
                    let m = Math.round(gridY / this.blockSize);
                    if (n < 0) n = 0;
                    if (m < 0) m = 0;
                    if (n >= this.gridWidth / this.blockSize) n = this.gridWidth / this.blockSize - 1;
                    if (m >= this.gridHeight / this.blockSize) m = this.gridHeight / this.blockSize - 1;

                    const cell = this.gridCoords[n][m];
                    cell.xOffset = this.xOffset;
                    cell.yOffset = this.yOffset;
                    cellToRender.push(cell);
                }
            }
        }

        return cellToRender;
    }

    create() {
        const c = this.getCellToRender();

        console.log("cell rendered : ", c.length);
        this.fillAllCells(c);
    }

    fillAllCells(cellToRender) {
        this.resetCanvas();
        cellToRender.flat().forEach((cellObj) => {
            cellObj.fillCell();
        });
    }

    newPanPoint(curPos) {
        this.panning = true;
        this.origin.x = curPos.x - this.xOffset;
        this.origin.y = curPos.y - this.yOffset;
    }

    pan(curPos) {
        this.xOffset = -Math.round(this.origin.x - curPos.x);
        this.yOffset = -Math.round(this.origin.y - curPos.y);
        console.log(-this.xOffset > this.gridWidth - this.viewPortWidth, this.xOffset)
        if (
            this.xOffset > 0 ||
            this.yOffset > 0 ||
            -this.xOffset > this.gridWidth - this.viewPortWidth ||
            -this.yOffset > this.gridHeight - this.viewPortHeight
        ) {
            if (this.xOffset > 0) {
                this.xOffset = 0;
            }
            if (this.yOffset > 0) {
                this.yOffset = 0;
            }
            if (-this.xOffset > this.gridWidth - this.viewPortWidth) {
                this.xOffset = -this.gridWidth + this.viewPortWidth;
            }
            if (-this.yOffset > this.gridHeight - this.viewPortHeight) {
                this.yOffset = -this.gridHeight + this.viewPortHeight;
            }

            this.newPanPoint(curPos);
        }
        console.log(this.xOffset)
        this.gridDiv.style.backgroundPosition = `${this.xOffset}px ${this.yOffset}px`;
        this.create();
    }

    stopPan() {
        this.panning = false;
    }

    getCellByCursor(cursorPos) {
        const x = plshelp.roundToPrevMult(Math.round(cursorPos.x - this.xOffset), this.blockSize);
        const y = plshelp.roundToPrevMult(Math.round(cursorPos.y - this.yOffset), this.blockSize);
        const flatCoord = this.getCellToRender().flat();
        const targetCell = flatCoord.find((n) => n.x === x && n.y === y);
        return targetCell;
    }

    addCellByCursor(cursorPos, object) {
        const cell = this.getCellByCursor(cursorPos);
        cell.setBlockType("wall");
        cell.setAsset(object);
        cell.fillCell();
    }

    removeCellByCursor(cursorPos) {
        const cell = this.getCellByCursor(cursorPos);
        cell.setBlockType("air");
        cell.fillCell();
    }

    addCol() {
        const prevCoords = Object.assign({}, this.gridCoords);
        this.gridWidth += this.blockSize;
        this.create(prevCoords);
    }

    addRow() {
        const prevCoords = Object.assign({}, this.gridCoords);
        this.gridHeight += this.blockSize;
        this.create(prevCoords);
    }

    removeCol() {
        const prevCoords = Object.assign({}, this.gridCoords);
        this.gridWidth -= this.blockSize;
        this.create(prevCoords);
    }

    removeRow() {
        const prevCoords = Object.assign({}, this.gridCoords);
        this.gridHeight -= this.blockSize;
        this.create(prevCoords);
    }

    getMap() {
        const nMap = gridNormal.normalize(this.gridCoords, this.blockSize, this.canvas);
        const debugBlocks = this.debugBlocks(nMap);

        return { width: this.gridWidth, height: this.gridHeight, coords: nMap, debugColliders: debugBlocks };
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
