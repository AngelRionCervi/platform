import { _G } from "../general/globals.js";
import { renderGrid } from "../editor/Grid.js";
import gridProps from "../editor/GridProps.js";
import { roundTo, loadImages } from "../../lib/helpers.js";
import gridCells from "../../lib/gridCells.js";

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
        this.zoomIndex = 0;
        this.zoomStep = 0.8;
        this.maxZoom = 2;
        this.minZoom = 0.5;
        this.still = false;
        this.zoomPos = { x: 0, y: 0 };
    }

    getCoords() {
        return { x: this.x, y: this.y };
    }

    getZoomPos() {
        return this.zoomPos;
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

    setScale({ dir, curPos }) {
        this.setStill(false);

        if (dir > 0) {
            this.scaleInc = -0.12;
        } else {
            this.scaleInc = 0.12;
        }

        /*
        const zoomCheck1 = Math.max(this.zoom, this.minZoom);
        const zoomCheck2 = Math.min(zoomCheck1, this.maxZoom);
        console.log(this.zoom, zoomCheck1, zoomCheck2);

        if (zoomCheck2 > this.zoom) {
            this.zoomIndex++;
        } else if (zoomCheck2 < this.zoom) {
            this.zoomIndex--;
        }*/

        const { gw, gh } = gridProps.getDim();

        this.zoom += this.scaleInc;

        const zoomWeight = {
            x: (curPos.x - this.toScreen(this.x)) / (gw * this.zoom),
            y: (curPos.y - this.toScreen(this.y)) / (gh * this.zoom),
        };

        const zoomWeight2 = {
            x: (curPos.x - this.toScreen(this.x)),
            y: (curPos.y - this.toScreen(this.y)),
        };

        const zw = {
            x: this.toWorld(curPos.x) - this.x,
            y: this.toWorld(curPos.y) - this.y,
        };

        //this.x = this.toWorld(curPos.x - this.toScreen(gw * 0.5));
        //this.y = this.toWorld(curPos.y - this.toScreen(gh * 0.5));
        //this.x = -gw/2;
        //this.y = -gh/2;
        
        const xd = curPos.x - this.zoomPos.x;
        const yd = curPos.y - this.zoomPos.y;
        const rpxX = curPos.x - this.toScreen(curPos.x);
        const rpxY = curPos.y - this.toScreen(curPos.y);

        console.log(this.toScreen(curPos.x));

        this.x = this.toWorld(curPos.x - this.toScreen(curPos.x));
        this.y = this.toWorld(curPos.y - this.toScreen(curPos.y));
        

        this.zoomPos = curPos;

        //console.log(this.toWorld(curPos.x - this.toScreen(curPos.x)), this.toWorld(curPos.x - this.toScreen(curPos.x)));

        /*
        setTimeout(() => {
            renderGrid();
        }, 0)*/
        //if (this.zoom < this.maxZoom && this.zoom > this.minZoom) {
        //console.log(this.toScreen(zoomWeight.x * gw * this.scaleInc));
        //this.x -= this.toScreen(zoomWeight.x * gw) * this.scaleInc;
        //this.y -= this.toScreen(zoomWeight.y * gh) * this.scaleInc;
        //this.x -= Math.floor(curPos.x * this.scaleInc);
        //this.y -= Math.floor(curPos.y * this.scaleInc);
        //}

        /*
        if (this.zoom > this.maxZoom) this.zoom = this.maxZoom;
        if (this.zoom < this.minZoom) this.zoom = this.minZoom;*/

        //this.pan(newPos)
        //gridDiv.style.backgroundImage = `url(${gridCells[`cell_${this.zoomIndex}`]})`;
        //gridDiv.style.backgroundPosition = `${this.x * this.zoom}px ${this.y * this.zoom}px`;
        return this;
    }

    getScale() {
        return this.scaleInc;
    }

    getZoom() {
        return this.zoom;
    }

    getZoomIndex() {
        return this.zoomIndex;
    }

    setCellsToInteract(gridCoords) {
        const cellToInteract = [];
        const gridWidth = gridProps.getWidth();
        const gridHeight = gridProps.getHeight();
        const bs = gridProps.getBlockSize();
        const tw = this.toWorld.bind(this);
        const ts = this.toScreen.bind(this);
        const trueBS = ts(bs);

        let lastCX;
        for (let x = this.x > 0 ? this.x : -bs; x < Math.round(tw(this.viewPortWidth) + bs); x += bs) {
            const n = Math.round((x - this.x) / bs);
            if (n > gridWidth / bs) break;
            const cx = n > 0 ? n - 1 : 0;
            if (lastCX !== cx) {
                lastCX = cx;
                /*
                gridCoords[cx].map((cell) => {
                    cell.setOffsetX(this.x);
                });
                if (cx > 0) {
                    const addedW = Math.abs(gridCoords[cx][0].tx() - gridCoords[cx - 1][0].tx()) - trueBS;
                    gridCoords[cx].map((cell) => {
                        cell.setBlockAddedW(addedW);
                    });
                }*/
                cellToInteract[cx] = [];
                for (let y = this.y > 0 ? this.y : -bs; y < Math.round(tw(this.viewPortHeight) + bs); y += bs) {
                    const m = Math.round((y - this.y) / bs);
                    if (m >= gridHeight / bs) break;

                    const cy = m > 0 ? m : 0;
                    const cell = gridCoords[cx][cy];
                    /*
                    cell.setOffsetY(this.y);
                    if (cy > 0) {
                        const addedH = Math.abs(cell.ty() - gridCoords[cx][cy - 1].ty()) - trueBS;
                        cell.setBlockAddedH(addedH);
                    }*/
                    //if (!cellToInteract[cx] || !cellToInteract[cx][cy]) continue;
                    // console.log(cx, cy)
                    cellToInteract[cx][cy] = cell;
                }
            }
            cellToInteract[cx] = cellToInteract[cx].filter((n) => n);
        }
        gridProps.setRenderedCells(cellToInteract.filter((n) => n));
    }

    newPanPoint(curPos) {
        this.panning = true;
        this.panOrigin.x = curPos.x - this.toScreen(this.x);
        this.panOrigin.y = curPos.y - this.toScreen(this.y);
    }

    pan(curPos) {
        this.setStill(false);
        this.x = Math.round(-this.toWorld(this.panOrigin.x - curPos.x));
        this.y = Math.round(-this.toWorld(this.panOrigin.y - curPos.y));
        console.log(this.x);

        /* //can't pan bayond the map
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
        //gridDiv.style.backgroundPosition = `${this.x * this.zoom}px ${this.y * this.zoom}px`;
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

    setStill(bool) {
        this.still = bool;
    }
}

export default new Camera();
