import { gridProps } from "../grid/Grid.js";

class CanvasBuffer {
    constructor(bufferType) {
        this.bufferType = bufferType;
        this.buffer = document.createElement("canvas");
        document.body.appendChild(this.buffer)
    }
    setBuffer() {
        this.buffer.width = gridProps.gridWidth;
        this.buffer.height = gridProps.gridHeight;
        return this;
    }
    createTempBuffer() {
        const tmpBuffer = document.createElement("canvas");
        tmpBuffer.width = this.buffer.width;
        tmpBuffer.height = this.buffer.height;
        tmpBuffer.getContext("2d").drawImage(this.buffer, 0, 0);
        return tmpBuffer;
    }
    addSizeUnitToBuffer(side) {
        const preResizeCanvas = this.createTempBuffer();
        const bufferCtx = this.getSceneBufferCtx();
        const bs = gridProps.getBlockSize();
        switch (side) {
            case "right":
                this.buffer.width += bs;
                bufferCtx.drawImage(preResizeCanvas, 0, 0);
                break;
            case "left":
                this.buffer.width += bs;
                bufferCtx.drawImage(preResizeCanvas, bs, 0);
                break;
            case "bottom":
                this.buffer.height += bs;
                bufferCtx.drawImage(preResizeCanvas, 0, 0);
                break;
            case "top":
                this.buffer.height += bs;
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
                this.buffer.width -= bs;
                bufferCtx.drawImage(preResizeCanvas, 0, 0);
                break;
            case "left":
                this.buffer.width -= bs;
                bufferCtx.drawImage(preResizeCanvas, -bs, 0);
                break;
            case "bottom":
                this.buffer.height -= bs;
                bufferCtx.drawImage(preResizeCanvas, 0, 0);
                break;
            case "top":
                this.buffer.height -= bs;
                bufferCtx.drawImage(preResizeCanvas, 0, -bs);
                break;
        }
    }
    updateBuffer(cell, object, slice) {
        if (this.bufferType === "scene") {
            cell.setBlockType("wall").setProp(object).setSlice(slice).fillBufferCell(this.bufferType);
        } else if (this.bufferType === "gameObject") {
            cell.setBlockType("wall").setGameObject(object).setGameObjectSlice(slice).fillBufferCell(this.bufferType);
        }
    }
    getBuffer() {
        return this.buffer;
    }
    getBufferCtx() {
        return this.getBuffer().getContext("2d");
    }
}

export const sceneBuffer = new CanvasBuffer("scene");
export const gameObjectBuffer = new CanvasBuffer("gameObject");