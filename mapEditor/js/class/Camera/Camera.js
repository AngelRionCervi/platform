import { _G } from "../general/globals.js";
import { Grid, renderGrid, fillAllCells, gridProps } from "../editor/Grid.js";
import { getContext, getCanvas } from "../general/canvasRef.js";
import { precise, roundTo } from "../../lib/helpers.js";

const ctx = getContext();
const canvas = getCanvas();

const gridDiv = document.getElementById("canvas_grid");

class Camera {
    constructor() {
        this.viewPortWidth = _G.viewPortWidth;
        this.viewPortHeight = _G.viewPortHeight;
        this.panOrigin = { x: 0, y: 0 };
        this.x = 0;
        this.y = 0;
        this.scaleInc = 1;
        this.zoom = 1;
        this.zoomStep = 0.8;
        this.maxZoom = this.zoomStep * 5;
        this.minZoom = this.zoomStep * 0.1;
    }

    getCoords() {
        return { x: this.x, y: this.y };
    }

    getViewPort() {
        return { vpWidth: this.viewPortWidth, vpHeight: this.viewPortHeight };
    }

    screenCoordToWorld({ x, y }) {
        return { wx: x / this.zoom, wy: y / this.zoom };
    }

    worldCoordToScreen({ x, y }) {
        return { sx: x * this.zoom, sy: y * this.zoom };
    }

    toWorld(number, ceil = null) {
        if (ceil) return Math.ceil(number / this.zoom);
        return Math.floor(number / this.zoom);
    }

    toScreen(number, ceil = null) {
        if (ceil) return Math.ceil(number * this.zoom);
        return Math.floor(number * this.zoom);
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
            this.scaleInc = 1 * this.zoomStep;
        } else {
            this.scaleInc = 1 / this.zoomStep;
        }
        const zoom = Math.max(roundTo(this.zoom * this.scaleInc, 2), this.minZoom);
        this.zoom = Math.min(zoom, this.maxZoom);

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

    setCellsToInteract(gridCoords) {
        const cellToInteract = [];
        const gridWidth = gridProps.getWidth();
        const gridHeight = gridProps.getHeight();
        const zoom = this.getZoom();
        const bs = gridProps.getBlockSize();
        const trueBS = Math.floor(bs * zoom);
        const tw = this.toWorld.bind(this);

        let lastCX;
        for (let x = this.x > 0 ? this.x : -bs; x < Math.round(tw(this.viewPortWidth) + bs); x += bs) {
            const n = Math.round((x - this.x) / bs);
            if (n > gridWidth / bs) break;
            const cx = n > 0 ? n - 1 : 0;
            if (lastCX !== cx) {
                lastCX = cx;
                gridCoords[cx].map((cell) => {
                    cell.setOffsetX(this.x);
                });
                if (cx > 0) {
                    const addedW = Math.abs(gridCoords[cx][0].tx() - gridCoords[cx - 1][0].tx()) - trueBS;
                    gridCoords[cx].map((cell) => {
                        cell.setBlockAddedW(addedW);
                    });
                }
                for (let y = this.y > 0 ? this.y : -bs; y < Math.round(tw(this.viewPortHeight) + bs); y += bs) {
                    const m = Math.round((y - this.y) / bs);
                    if (m >= gridHeight / bs) break;

                    const cy = m > 0 ? m : 0;
                    const cell = gridCoords[cx][cy];
                    cell.setOffsetY(this.y);
                    if (cy > 0) {
                        const addedH = Math.abs(cell.ty() - gridCoords[cx][cy - 1].ty()) - trueBS;
                        cell.setBlockAddedH(addedH);
                    }
                    cellToInteract.push(cell);
                }
            }
        }
        gridProps.setRenderedCells(cellToInteract);
    }

    newPanPoint(curPos) {
        this.panning = true;
        this.panOrigin.x = curPos.x - this.toScreen(this.x);
        this.panOrigin.y = curPos.y - this.toScreen(this.y);
    }

    pan(curPos) {
        this.x = Math.round(-this.toWorld(this.panOrigin.x - curPos.x));
        this.y = Math.round(-this.toWorld(this.panOrigin.y - curPos.y));

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
        //gridDiv.style.backgroundSize = `${bs * this.zoom}px`;
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
}

export default new Camera();
