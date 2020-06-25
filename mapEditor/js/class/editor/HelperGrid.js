import gridProps from "./GridProps.js";
import camera from "../Camera/Camera.js";
import { _G } from "../general/globals.js";

const { vpWidth, vpHeight } = camera.getViewPort();
const ts = camera.toScreen.bind(camera);

export default class HelperGrid {
    constructor() {
        this.buffer = document.createElement("canvas");
        this.ctx = this.buffer.getContext("2d");
        this.buffer.width = vpWidth;
        this.buffer.height = vpHeight;
    }

    build() {
        const camCoord = camera.getCoords();
        const flatCells = gridProps.getRenderedCells();
        const xs = flatCells.map((row) => row[0].x);
        const ys = flatCells[0].map((col) => col.y);
        const { gw, gh } = gridProps.getDim();

        this.ctx.clear(true);
        this.ctx.setLineDash(_G.gridDashes);

        for (let u = 0, len = xs.length; u < len; u++) {
            const cellX = camCoord.x + xs[u];
            this.ctx.beginPath();
            this.ctx.moveTo(0.5 + ts(cellX), ts(camCoord.y));
            this.ctx.lineTo(0.5 + ts(cellX), ts(camCoord.y + gh));
            this.ctx.stroke();
        }

        for (let u = 0, len = ys.length; u < len; u++) {
            const cellY = camCoord.y + ys[u];
            this.ctx.beginPath();
            this.ctx.moveTo(ts(camCoord.x), 0.5 + ts(cellY));
            this.ctx.lineTo(ts(camCoord.x + gw), 0.5 + ts(cellY));
            this.ctx.stroke();
        }
    }

    getBuffer() {
        return this.buffer;
    }
}
