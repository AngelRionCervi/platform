import gridProps from "./GridProps.js";
import camera from "../Camera/Camera.js";

const bs = gridProps.getBlockSize();
const { vpWidth, vpHeight } = camera.getViewPort();
const tw = camera.toWorld.bind(camera);
const ts = camera.toScreen.bind(camera);

export default class HelperGrid {
    constructor() {
        this.buffer = document.createElement("canvas");
        this.ctx = this.buffer.getContext("2d");
        this.buffer.width = vpWidth;
        this.buffer.height = vpHeight;
    }

    build() {
        const index = camera.getZoomIndex();
        const camCoord = camera.getCoords();
        const flatCells = gridProps.getRenderedCells().flat();

        this.ctx.clear(true);
        this.ctx.setLineDash([2, 4]);

        this.ctx.strokeStyle = "rgba(105, 105, 105, 0.6)";
        for (let u = 0, len = flatCells.length; u < len; u++) {
            const cellX = camCoord.x + flatCells[u].x;
            const cellY = camCoord.y + flatCells[u].y;

            this.ctx.beginPath();
            this.ctx.moveTo(0.5 + ts(cellX), 0.5 + ts(cellY));
            this.ctx.lineTo(0.5 + ts(cellX + bs), 0.5 + ts(cellY));
            this.ctx.lineTo(0.5 + ts(cellX + bs), 0.5 + ts(cellY + bs));
            this.ctx.stroke();
        }
    }

    getBuffer() {
        return this.buffer;
    }
}
