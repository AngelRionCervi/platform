import { gridProps } from "../grid/Grid.js";

class SceneBuffer {
    constructor() {
        this.sceneBuffer = document.createElement("canvas");
    }
    setBuffer() {
        this.sceneBuffer.width = gridProps.gridWidth;
        this.sceneBuffer.height = gridProps.gridHeight;
        document.body.appendChild(this.sceneBuffer);
        return this;
    }
    createTempBuffer() {
        const preResizeCanvas = document.createElement("canvas");
        preResizeCanvas.width = this.sceneBuffer.width;
        preResizeCanvas.height = this.sceneBuffer.height;
        preResizeCanvas.getContext("2d").drawImage(this.sceneBuffer, 0, 0);
        return preResizeCanvas;
    }
    addSizeUnitToBuffer(side) {
        const preResizeCanvas = this.createTempBuffer();
        const bufferCtx = this.getSceneBufferCtx();
        const bs = gridProps.getBlockSize();
        switch (side) {
            case "right":
                this.sceneBuffer.width += bs;
                bufferCtx.drawImage(preResizeCanvas, 0, 0);
                break;
            case "left":
                this.sceneBuffer.width += bs;
                bufferCtx.drawImage(preResizeCanvas, bs, 0);
                break;
            case "bottom":
                this.sceneBuffer.height += bs;
                bufferCtx.drawImage(preResizeCanvas, 0, 0);
                break;
            case "top":
                this.sceneBuffer.height += bs;
                bufferCtx.drawImage(preResizeCanvas, 0, bs);
                break;
        }
        return this;
    }
    removeSizeUnitToBuffer(side) {
        const preResizeCanvas = this.createTempBuffer();
        const bufferCtx = this.getSceneBufferCtx();
        const bs = gridProps.getBlockSize();
        switch (side) {
            case "right":
                this.sceneBuffer.width -= bs;
                bufferCtx.drawImage(preResizeCanvas, 0, 0);
                break;
            case "left":
                this.sceneBuffer.width -= bs;
                bufferCtx.drawImage(preResizeCanvas, -bs, 0);
                break;
            case "bottom":
                this.sceneBuffer.height -= bs;
                bufferCtx.drawImage(preResizeCanvas, 0, 0);
                break;
            case "top":
                this.sceneBuffer.height -= bs;
                bufferCtx.drawImage(preResizeCanvas, 0, -bs);
                break;
        }
    }
    updateBuffer(cell, object, slice) {
        cell.setBlockType("wall").setProp(object).setSlice(slice).fillSceneBufferCell(this.getBufferCtx());
    }
    getBuffer() {
        return this.sceneBuffer;
    }
    getBufferCtx() {
        return this.getBuffer().getContext("2d");
    }
}

export default new SceneBuffer();