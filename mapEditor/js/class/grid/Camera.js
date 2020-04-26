import { _G } from "../../lib/globals.js";
import { Grid, renderGrid, fillAllCells, gridProps } from "./Grid.js";

const gridDiv = document.getElementById("canvas_grid");

export default class Camera {
    constructor() {
        this.blockSize = _G.blockSize;
        this.viewPortWidth = _G.viewPortWidth;
        this.viewPortHeight = _G.viewPortHeight;
        this.panOrigin = { x: 0, y: 0 };
        this.x = 0;
        this.y = 0;
    }

    getCellsToRender(gridCoords) {
        const cellToRender = [];
        const gridWidth = gridProps.getWidth();
        const gridHeight = gridProps.getHeight();

        for (let x = this.x / this.blockSize; x < this.viewPortWidth / this.blockSize; x++) {
            for (let y = this.y / this.blockSize; y < this.viewPortHeight / this.blockSize; y++) {
                if (x >= -1 && y >= -1) {
                    const gridX = x * this.blockSize - this.x;
                    const gridY = y * this.blockSize - this.y;
                    let n = Math.round(gridX / this.blockSize);
                    let m = Math.round(gridY / this.blockSize);
                    if (n < 0) n = 0;
                    if (m < 0) m = 0;
                    if (n >= gridWidth / this.blockSize) n = gridWidth / this.blockSize - 1;
                    if (m >= gridHeight / this.blockSize) m = gridHeight / this.blockSize - 1;

                    const cell = gridCoords[n][m];
                    cell.xOffset = this.x;
                    cell.yOffset = this.y;
                    cellToRender.push(cell);
                }
            }
        }

        return cellToRender;
    }

    newPanPoint(curPos) {
        this.panning = true;
        this.panOrigin.x = curPos.x - this.x;
        this.panOrigin.y = curPos.y - this.y;
    }

    pan(curPos) {
        this.x = -Math.round(this.panOrigin.x - curPos.x);
        this.y = -Math.round(this.panOrigin.y - curPos.y);

        const gridWidth = gridProps.getWidth();
        const gridHeight = gridProps.getHeight();

        if (
            this.x > 0 ||
            this.y > 0 ||
            -this.x > gridWidth - this.viewPortWidth ||
            -this.y > gridHeight - this.viewPortHeight
        ) {
            if (this.x > 0) {
                this.x = 0;
            }
            if (this.y > 0) {
                this.y = 0;
            }
            if (-this.x > gridWidth - this.viewPortWidth) {
                this.x = -gridWidth + this.viewPortWidth;
            }
            if (-this.y > gridHeight - this.viewPortHeight) {
                this.y = -gridHeight + this.viewPortHeight;
            }

            this.newPanPoint(curPos);
        }
    
        gridDiv.style.backgroundPosition = `${this.x}px ${this.y}px`;
        renderGrid();
    }

    stopPan() {
        this.panning = false;
    }

    watchPos() {
        //const coords = gridProps.getCoords();
        console.log(-this.y + this.viewPortHeight, gridProps.getHeight());
        if (-this.x + this.viewPortWidth > gridProps.getWidth()) {
            this.x += this.blockSize;
        }
        if (-this.y + this.viewPortHeight > gridProps.getHeight()) {
            this.y += this.blockSize;
        }
    }
}
