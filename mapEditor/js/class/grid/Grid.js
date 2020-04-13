import { Cell } from "./Cell.js";
import { GridNormalization } from "./GridNormalization.js";
import * as plshelp from "../../lib/helpers.js";
import { _GLOBALS_ } from "../../lib/globals.js";

const gridNormal = new GridNormalization();

export class Grid {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.origin = { x: 0, y: 0 };
        this.gridWidth = 1024;
        this.gridHeight = 576;
        this.viewPortWidth = 1024;
        this.viewPortHeight = 576;
        this.blockSize = _GLOBALS_.blockSize;
        this.colliderW = 3;
        this.gridCoords;
        this.cellFillStyle = "black";
        this.panning = false;

        this.xOffset = 0;
        this.yOffset = 0
    }

    create(prevCoords = []) {;
        this.gridCoords = new Array(this.gridWidth / this.blockSize);

        for (let u = 0; u < this.gridCoords.length; u++) {
            this.gridCoords[u] = new Array(this.gridHeight / this.blockSize);
        }

        this.canvas.width = this.gridWidth;
        this.canvas.height = this.gridHeight;

        let idStart = 0;

        for (let x = this.xOffset; x < this.viewPortWidth; x += this.blockSize) {
            for (let y = this.yOffset; y < this.viewPortHeight; y += this.blockSize) {
                const id = (x + y) / this.blockSize + idStart;
                let cellObj = new Cell(this.ctx, id, x, y, "air", this.blockSize, null);

                if (prevCoords[x / this.blockSize] && prevCoords[x / this.blockSize][y / this.blockSize]) {
                    const prevCellObj = prevCoords[x / this.blockSize][y / this.blockSize];
                    prevCellObj.id = (x + y) / this.blockSize + idStart;
                    cellObj = prevCellObj;
                }

                let gridX = Math.round((x - this.xOffset) / this.blockSize);
                let gridY = Math.round((y - this.yOffset) / this.blockSize);
                if (gridX > 31) gridX = 31;
                if (gridY > 20) gridY = 20;
                this.gridCoords[gridX][gridY] = cellObj;
            }

            const minSide = Math.min(this.gridWidth, this.gridHeight);
            idStart += minSide / this.blockSize - 1;
        }

        this.fillAllCells();
    }

    fillAllCells() {
        this.gridCoords.flat().forEach((cellObj) => {
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
        console.log(this.xOffset, this.yOffset)
        console.log("panning");
        this.create([]);
    }

    stopPan() {
        this.panning = false;
    }

    getCellByCursor(cursorPos) {
        const roundX = plshelp.roundToPrevMult(cursorPos.x, this.blockSize);
        const roundY = plshelp.roundToPrevMult(cursorPos.y, this.blockSize);
        const flatCoord = this.gridCoords.flat();
        const targetCell = flatCoord.find((n) => n.x === roundX && n.y === roundY);

        return targetCell;
    }

    addCellByCursor(cursorPos, object) {
        const cell = this.getCellByCursor(cursorPos);
        /*
        cell.setBlockType('wall');
        cell.setAsset(object);
        cell.fillCell();*/
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
