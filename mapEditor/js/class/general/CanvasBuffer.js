import { gridProps } from "../grid/Grid.js";
import camera from "../Camera/Camera.js";
import * as _H from "../../lib/helpers.js";

class CanvasBuffer {
    constructor(bufferType) {
        this.bufferType = bufferType;
        this.buffer = document.createElement("canvas");
    }
    setBuffer(asset = null) {
        if (asset) {
            this.buffer.width = asset.getWidth();
            this.buffer.height = asset.getHeight();
        } else {
            this.buffer.width = gridProps.gridWidth;
            this.buffer.height = gridProps.gridHeight;
        }
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
        const bufferCtx = this.getBufferCtx();
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
        const bufferCtx = this.getBufferCtx();
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

class GameObjectBufferList {
    constructor() {
        this.list = [];
        this.mainBuffer = document.createElement("canvas");
    }

    add(asset, coords) {
        const bufferObj = new CanvasBuffer("gameObject");
        bufferObj.setBuffer(asset);
        const id = _H.uniqid("b");
        this.list.push({ id, bufferObj, coords });
        bufferObj.getBufferCtx().drawImage(asset.getSprite(), 0, 0);
        return id;
    }

    remove(id) {
        this.list.splice(this.list.map((el) => el.id).indexOf(id), 1);
    }

    update() {
        this.getMainBufferCtx().clear(true);
        const tw = camera.toWorld.bind(camera);
        const ts = camera.toScreen.bind(camera);
        const camCoords = camera.getCoords();
        this.mainBuffer.width = gridProps.gridWidth;
        this.mainBuffer.height = gridProps.gridHeight;

        this.list.forEach((buffer) => {
            this.getMainBufferCtx().drawImage(buffer.bufferObj.getBuffer(), buffer.coords.x, buffer.coords.y);
        });
    }

    getMainBuffer() {
        return this.mainBuffer;
    }

    getMainBufferCtx() {
        return this.getMainBuffer().getContext("2d");
    }
}

export const gameObjectBufferList = new GameObjectBufferList();
