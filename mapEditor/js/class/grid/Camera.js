import { _G } from "../../lib/globals.js";
import { Grid, renderGrid, fillAllCells, gridProps } from "./Grid.js";
import { getContext, getCanvas } from "../general/canvasRef.js";
import { precise } from "../../lib/helpers.js";

const ctx = getContext();
const canvas = getCanvas();

const gridDiv = document.getElementById("canvas_grid");

export default class Camera {
    constructor() {
        this.viewPortWidth = _G.viewPortWidth;
        this.viewPortHeight = _G.viewPortHeight;
        this.panOrigin = { x: 0, y: 0 };
        this.x = 0;
        this.y = 0;
        this.scaleInc = 1;
        this.zoom = 1;
    }

    getCoords() {
        return { x: this.x, y: this.y };
    }

    getViewPort() {
        return { width: this.viewPortWidth, height: this.viewPortHeight };
    }

    setScale({ dir }) {
        /*
        if (this.scaleTrack > 0 && dir > 0) {
            this.scaleTrack -= 10;
            this.scaleInc = 0.9;
        }

        if (this.scaleTrack < 100 && dir < 0) {
            this.scaleTrack += 10;
            this.scaleInc = 1.1;
        }

        if (this.scaleTrack <= 0 || this.scaleTrack >= 100) {
            this.scaleInc = 1;
        }*/

        if (dir > 0) {
            this.scaleInc = 1 * 0.8;
        } else {
            this.scaleInc = 1 / 0.8;
        }
        this.zoom *= this.scaleInc;

        //this.viewPortWidth /= this.scaleInc;
        //this.viewPortHeight /= this.scaleInc;
        //this.x = this.x + curPos.x / this.scaleInc - curPos.x;
        //this.y = this.y + curPos.y / this.scaleInc - curPos.y;
    }

    getScale() {
        return this.scaleInc;
    }

    getZoom() {
        return this.zoom;
    }

    getCellsToRender(gridCoords) {
        const cellToRender = [];
        const gridWidth = gridProps.getWidth();
        const gridHeight = gridProps.getHeight();
        const bs = gridProps.getBlockSize();

        for (let x = this.x; x < Math.round(this.viewPortWidth / this.zoom); x += bs) {
            for (let y = this.y; y < Math.round(this.viewPortHeight / this.zoom); y += bs) {
                let n = Math.round((x - this.x) / bs);
                let m = Math.round((y - this.y) / bs);

                if (n >= gridWidth / bs || m >= gridHeight / bs) break;

                const cell = gridCoords[n][m];
                if (
                    (cell?.prop?.obj.asset.width + x > 0 && cell?.prop?.obj.asset.height + y > 0) ||
                    (x >= -bs && y >= -bs)
                ) {
                    cell.setOffsets(this.x, this.y);
                    cellToRender.push(cell);
                }
            }
        }
        gridProps.setRenderedCells(cellToRender);
        return cellToRender;
    }

    newPanPoint(curPos) {
        this.panning = true;
        this.panOrigin.x = curPos.x - this.x * this.zoom;
        this.panOrigin.y = curPos.y - this.y * this.zoom;
    }

    pan(curPos) {
        this.x = -(this.panOrigin.x - curPos.x) / this.zoom;
        this.y = -(this.panOrigin.y - curPos.y) / this.zoom;

        /* //can't pan bayonf the map
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
        }*/
        const bs = gridProps.getBlockSize();
        gridDiv.style.backgroundSize = `${bs * this.zoom}px`;
        gridDiv.style.backgroundPosition = `${this.x * this.zoom}px ${this.y * this.zoom}px`;
        renderGrid();
    }

    stopPan() {
        this.panning = false;
    }

    moveRight(distance) {
        this.x -= distance;
    }

    moveLeft(distance) {
        this.x += distance;
    }

    moveBottom(distance) {
        this.y -= distance;
    }

    moveTop(distance) {
        this.y += distance;
    }

    watchPos() {
        //const coords = gridProps.getCoords();
        //console.log(-this.y + this.viewPortHeight, gridProps.getHeight());
        /*
        if (-this.x + this.viewPortWidth < gridProps.getWidth()) {
            this.x += this.blockSize;
        }
        if (-this.y + this.viewPortHeight > gridProps.getHeight()) {
            this.y += this.blockSize;
        }*/
    }
}
