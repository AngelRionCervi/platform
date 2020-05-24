import { gridProps } from "../grid/Grid.js";

class SceneBuffer {
    constructor() {
        this.gameObjectBuffer = document.createElement("canvas");
    }
    setBuffer() {
        this.gameObjectBuffer.width = gridProps.gridWidth;
        this.gameObjectBuffer.height = gridProps.gridHeight;
        document.body.appendChild(this.gameObjectBuffer);
        return this;
    }
    createTempBuffer() {
        const preResizeCanvas = document.createElement("canvas");
        preResizeCanvas.width = this.gameObjectBuffer.width;
        preResizeCanvas.height = this.gameObjectBuffer.height;
        preResizeCanvas.getContext("2d").drawImage(this.gameObjectBuffer, 0, 0);
        return preResizeCanvas;
    }
    addSizeUnitToBuffer(side) {
        const preResizeCanvas = this.createTempBuffer();
        const bufferCtx = this.getSceneBufferCtx();
        const bs = gridProps.getBlockSize();
        switch (side) {
            case "right":
                this.gameObjectBuffer.width += bs;
                bufferCtx.drawImage(preResizeCanvas, 0, 0);
                break;
            case "left":
                this.gameObjectBuffer.width += bs;
                bufferCtx.drawImage(preResizeCanvas, bs, 0);
                break;
            case "bottom":
                this.gameObjectBuffer.height += bs;
                bufferCtx.drawImage(preResizeCanvas, 0, 0);
                break;
            case "top":
                this.gameObjectBuffer.height += bs;
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
                this.gameObjectBuffer.width -= bs;
                bufferCtx.drawImage(preResizeCanvas, 0, 0);
                break;
            case "left":
                this.gameObjectBuffer.width -= bs;
                bufferCtx.drawImage(preResizeCanvas, -bs, 0);
                break;
            case "bottom":
                this.gameObjectBuffer.height -= bs;
                bufferCtx.drawImage(preResizeCanvas, 0, 0);
                break;
            case "top":
                this.gameObjectBuffer.height -= bs;
                bufferCtx.drawImage(preResizeCanvas, 0, -bs);
                break;
        }
    }
    updateBuffer(cell, object, slice) {
        cell.setBlockType("wall").setProp(object).setSlice(slice).fillBufferCell("gameObject");
    }
    getBuffer() {
        return this.gameObjectBuffer;
    }
    getBufferCtx() {
        return this.getBuffer().getContext("2d");
    }
}

export default new SceneBuffer();