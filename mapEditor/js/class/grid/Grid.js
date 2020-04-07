import { Cell } from './Cell.js';
import { GridNormalization } from './GridNormalization.js';
import * as plshelp from '../../lib/helpers.js';

const gridNormal = new GridNormalization();

export class Grid {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.gridWidth = 1024;
        this.gridHeight = 576;
        this.blockSize = 32;
        this.colliderW = 3;
        this.gridCoords;
        this.cellFillStyle = "black";
    }

    create(prevCoords = []) {

        this.gridCoords = new Array(this.gridWidth / this.blockSize);

        for (let u = 0; u < this.gridCoords.length; u++) {
            this.gridCoords[u] = new Array(this.gridHeight / this.blockSize);
        }

        this.canvas.width = this.gridWidth;
        this.canvas.height = this.gridHeight;

        let idStart = 0;

        for (let x = 0; x < this.gridWidth; x += this.blockSize) {
            for (let y = 0; y < this.gridHeight; y += this.blockSize) {

                const id = (x + y) / this.blockSize + idStart;
                let cellObj = new Cell(this.ctx, id, x, y, "air", this.blockSize, null);

                if (prevCoords[x / this.blockSize] && prevCoords[x / this.blockSize][y / this.blockSize]) {
                    const prevCellObj = prevCoords[x / this.blockSize][y / this.blockSize];
                    prevCellObj.id = (x + y) / this.blockSize + idStart;
                    cellObj = prevCellObj;
                }
                
                this.gridCoords[x / this.blockSize][y / this.blockSize] = cellObj;
            }

            const minSide = Math.min(this.gridWidth, this.gridHeight)
            idStart += minSide / this.blockSize - 1;
        }

        this.fillAllCells();
    }

    fillAllCells() {
        this.gridCoords.flat().forEach((cellObj) => {
            cellObj.fillCell();
        })
    }

    getCellByCursor(cursorPos) {
        const roundX = plshelp.roundToPrevMult(cursorPos.x, this.blockSize);
        const roundY = plshelp.roundToPrevMult(cursorPos.y, this.blockSize);
        const flatCoord = this.gridCoords.flat();
        const targetCell = flatCoord.find(n => n.x === roundX && n.y === roundY);

        return targetCell;
    }

    addCellByCursor(cursorPos, asset) {
        const cell = this.getCellByCursor(cursorPos);
        cell.setBlockType('wall');
        cell.setAsset(asset);
        cell.fillCell();
    }

    removeCellByCursor(cursorPos) {
        const cell = this.getCellByCursor(cursorPos);
        cell.setBlockType('air');
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
        console.log('nMap', nMap)

        const colliders = [];
        
        nMap.forEach((v) => {
            colliders.push([{ type: 'yWall', x: v.x + this.colliderW, y: v.y, w: v.w - this.colliderW, h: this.colliderW }, //top
                { type: 'yWall', x: v.x + this.colliderW, y: v.y + v.h - this.colliderW, w: v.w - this.colliderW, h: this.colliderW }, //bottom
                { type: 'xWall', x: v.x, y: v.y, w: this.colliderW, h: v.h }, //left
                { type: 'xWall', x: v.x + v.w - this.colliderW, y: v.y, w: this.colliderW, h: v.h }]); //right
        })

        return colliders;
    }
}