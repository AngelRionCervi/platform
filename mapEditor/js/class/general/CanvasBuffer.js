import { gridProps } from "../grid/Grid.js";
import camera from "../Camera/Camera.js";
import * as _H from "../../lib/helpers.js";

class CanvasBuffer {
    constructor() {
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
    updateBuffer(cell, object, slice, type) {
        if (type === "sceneObject") {
            cell.setBlockType("wall").setProp(object).setSceneObjectSlice(slice).fillBufferCell();
        } else if (type === "gameObject") {
            cell.setBlockType("wall").setGameObject(object);
        }
    }
    getBuffer() {
        return this.buffer;
    }
    getBufferCtx() {
        return this.getBuffer().getContext("2d");
    }
}

export const sceneBuffer = new CanvasBuffer();


class GameObjectBufferList {
    constructor() {
        this.list = [];
        this.mainBuffer = document.createElement("canvas");
        setTimeout(() => {
            // next callstack
            this.mainBuffer.width = gridProps.gridWidth;
            this.mainBuffer.height = gridProps.gridHeight;
        }, 0);
    }

    add(gObj, coord) {
        const bufferObj = new CanvasBuffer("gameObject");
        const asset = gObj.getAsset();
        const showObjID = gObj.getUniqID();
        bufferObj.setBuffer(asset);
        const id = _H.uniqid("b");
        this.list.push({ id, showObjID, bufferObj, coord, asset, index: this.list.length - 1 });
        bufferObj.getBufferCtx().drawImage(asset.getSprite(), 0, 0);
        return id;
    }

    remove(id) {
        this.list.splice(this.list.map((el) => el.id).indexOf(id), 1);
    }

    update() {
        this.getMainBufferCtx().clear(true);
        this.list.forEach((buffer) => {
            this.getMainBufferCtx().drawImage(buffer.bufferObj.getBuffer(), buffer.coord.x, buffer.coord.y);
        });
    }

    getBufferByCoord(coord) {
        const tw = camera.toWorld.bind(camera);
        const wCoord = { x: tw(coord.x), y: tw(coord.y) };
        let buffer = null;
        for (let u = 0; u < this.list.length; u++) {
            const bufferCoord = this.list[u].coord;
            const assetW = this.list[u].asset.getWidth();
            const assetH = this.list[u].asset.getHeight();
            if (
                wCoord.x >= bufferCoord.x &&
                wCoord.x <= bufferCoord.x + assetW &&
                wCoord.y >= bufferCoord.y &&
                wCoord.y <= bufferCoord.y + assetH
            ) {
                if (!buffer || buffer.index < this.list[u].index) {
                    buffer = this.list[u];
                }
            }
        }
        return buffer;
    }

    getMainBuffer() {
        return this.mainBuffer;
    }

    getMainBufferCtx() {
        return this.getMainBuffer().getContext("2d");
    }
}

export const gameObjectBufferList = new GameObjectBufferList();
