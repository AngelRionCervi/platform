import { _G } from "../general/globals.js";
import { renderGrid } from "../editor/Grid.js";
import gridProps from "../editor/GridProps.js";

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
        this.maxZoom = 10;
        this.minZoom = 0.08;
        this.still = false;
        this.prevZoom = { x: 0, y: 0 };
        this.planShift = { x: 0, y: 0 };
        this.zoomOffset = null;
    }

    getCoords() {
        return { x: this.x, y: this.y };
    }

    get worldX() {
        return Math.floor(this.x / this.zoom);
    }

    get worldY() {
        return Math.floor(this.y / this.zoom);
    }

    getZoomPos() {
        return this.prevZoom;
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

    toWorld(number, roundType = null) {
        if (roundType === "noRound") return number / this.zoom;
        if (roundType === "round") return Math.round(number / this.zoom);
        if (roundType) return Math.ceil(number / this.zoom);
        return Math.floor(number / this.zoom);
    }

    toScreen(number, roundType = null) {
        if (roundType === "noRound") return number * this.zoom;
        if (roundType === "round") return Math.round(number * this.zoom);
        if (roundType) return Math.ceil(number * this.zoom);
        return Math.floor(number * this.zoom);
    }

    setScale({ dir, curPos }) {
        this.setStill(false);

        if (dir > 0) {
            this.scaleInc = 1 * this.zoomStep;
        } else {
            this.scaleInc = 1 / this.zoomStep;
        }

        const { x, y } = curPos;

        const oldZoom = this.zoom; // old zoom
        this.zoom *= this.scaleInc;

        if (this.zoom <= this.minZoom) this.zoom = this.minZoom;
        if (this.zoom >= this.maxZoom) this.zoom = this.maxZoom;

        /* We want in-world coordinates to remain the same:
         * (x + this.x')/this.zoom = (x + this.x)/zoom
         * (y + this.y')/this.zoom = (y + this.y)/zoom
         * =>
         */
        this.x = Math.round(-(this.toScreen(x - this.x, "noRound") / oldZoom - x));
        this.y = Math.round(-(this.toScreen(y - this.y, "noRound") / oldZoom - y));
        return this;
    }

    getViewX(x) {
        return x - this.x;
    }

    debugPos(curPos) {
        const xd = this.toWorld(curPos.x - this.prevZoom.x);
        const yd = this.toWorld(curPos.y - this.prevZoom.y);
        const rpxX = curPos.x - this.toScreen(curPos.x);
        const rpxY = curPos.y - this.toScreen(curPos.y);

        const { gw, gh } = gridProps.getDim();

        const x1 = this.toWorld(curPos.x) - curPos.x;
        const y1 = this.toWorld(curPos.y) - curPos.y;

        const worldPos = { x: this.toWorld(curPos.x) - this.x, y: this.toWorld(curPos.y) - this.y };
        const weight = { x: worldPos.x / gw, y: worldPos.y / gh };

        const altX = this.x - weight.x * gw * 0.05;
        // console.log(xd);
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
        for (let x = tw(this.x) > 0 ? tw(this.x) : -bs; x < Math.round(tw(this.viewPortWidth) + bs); x += bs) {
            const n = Math.round((x - tw(this.x)) / bs);
            if (n > gridWidth / bs) break;
            const cx = n > 0 ? n - 1 : 0;
            if (lastCX !== cx) {
                lastCX = cx;
/*
                if (cx > 0) {
                    const addedW = Math.abs(gridCoords[cx][0].tx - gridCoords[cx - 1][0].tx) - trueBS;
                    gridCoords[cx - 1].forEach((cell, i, a) => {
                        cell.setBlockAddedW(addedW);
                    });
                }*/
                cellToInteract[cx] = [];
                for (let y = tw(this.y) > 0 ? tw(this.y) : -bs; y < Math.round(tw(this.viewPortHeight) + bs); y += bs) {
                    const m = Math.round((y - tw(this.y)) / bs);
                    if (m >= gridHeight / bs) break;

                    const cy = m > 0 ? m : 0;
                    const cell = gridCoords[cx][cy];
                    /*
                    if (cy > 0) {
                        const addedH = Math.abs(cell.ty - gridCoords[cx][cy - 1].ty) - trueBS;
                        gridCoords[cx][cy - 1].setBlockAddedH(addedH);
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
        this.panOrigin.x = curPos.x - this.x;
        this.panOrigin.y = curPos.y - this.y;
    }

    pan(curPos) {
        this.setStill(false);
        this.x = Math.round(-(this.panOrigin.x - curPos.x));
        this.y = Math.round(-(this.panOrigin.y - curPos.y));

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
