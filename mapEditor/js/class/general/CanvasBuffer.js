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
    updateBuffer(cell, object, slice, type) {
        if (type === "sceneObject") {
            cell.setBlockType("wall").setProp(object).setSceneObjectSlice(slice).fillBufferCell();
        } else if (type === "gameObject") {
            //cell.setBlockType("wall").setGameObject(object);
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
            this.mainBuffer.width = gridProps.getWidth();
            this.mainBuffer.height = gridProps.getHeight();
        }, 0);
    }

    add(gObj, coord) {
        const bufferObj = new CanvasBuffer();
        const asset = gObj.getAsset();
        const showObjID = gObj.getUniqID();
        bufferObj.setBuffer(asset);
        const id = _H.uniqid("b");
        this.list.push({ id, showObjID, bufferObj, coord, asset, index: this.list.length });
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
        const camCoord = camera.getCoords();
        const wCoord = { x: tw(coord.x), y: tw(coord.y) };
        let buffer = null;
        for (let u = 0; u < this.list.length; u++) {
            const bufferCoord = this.list[u].coord;
            const assetW = this.list[u].asset.getWidth();
            const assetH = this.list[u].asset.getHeight();
            if (
                wCoord.x >= bufferCoord.x + camCoord.x &&
                wCoord.x <= bufferCoord.x + camCoord.x + assetW &&
                wCoord.y >= bufferCoord.y + camCoord.y &&
                wCoord.y <= bufferCoord.y + camCoord.y + assetH
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

    getBuffer() {
        return this.mainBuffer;
    }

    setCoord(id, coord) {
        const buffer = this.list.find(el => el.id === id);
        buffer.coord = coord;
    }

    getObjectsBuffer(ids = null) {
        if (!ids) return this.list;
        return this.list.filter((el) => ids.includes(el.id));
    }
}

export const gameObjectBufferList = new GameObjectBufferList();

function getMainBuffers() {
    return [
        { buffer: gameObjectBufferList, type: "gameObjects" },
        { buffer: sceneBuffer, type: "sceneObjects" },
    ];
}

function savePreResize(buffer) {
    const tmpBuffer = document.createElement("canvas");
    tmpBuffer.width = buffer.width;
    tmpBuffer.height = buffer.height;
    tmpBuffer.getContext("2d").drawImage(buffer, 0, 0);
    return tmpBuffer;
}

export function changeBufferSize(side, way) {
    const mainBuffers = getMainBuffers();

    mainBuffers.forEach(({ buffer, type }) => {
        const bufferEl = buffer.getBuffer();
        const preResizeCanvas = savePreResize(bufferEl);
        const bufferCtx = bufferEl.getContext("2d");
        const bs = way === "add" ? gridProps.getBlockSize() : -gridProps.getBlockSize();

        if (type === "gameObjects") {
            buffer.list.forEach((goBuffer, index, list) => {
                switch (side) {
                    case "left":
                        goBuffer.coord.x += bs;
                        break;
                    case "top":
                        goBuffer.coord.y += bs;
                        break;
                }
                // delete game object if out of bounds;
                if (
                    goBuffer.coord.x + goBuffer.bufferObj.buffer.width <= 0 ||
                    goBuffer.coord.y + goBuffer.bufferObj.buffer.height <= 0 ||
                    goBuffer.coord.x >= gridProps.getWidth() ||
                    goBuffer.coord.y >= gridProps.getHeight()
                ) {
                    list.splice(index, 1);
                }
            });
        }

        switch (side) {
            case "right":
                bufferEl.width += bs;
                bufferCtx.drawImage(preResizeCanvas, 0, 0);
                break;
            case "left":
                bufferEl.width += bs;
                bufferCtx.drawImage(preResizeCanvas, bs, 0);
                break;
            case "bottom":
                bufferEl.height += bs;
                bufferCtx.drawImage(preResizeCanvas, 0, 0);
                break;
            case "top":
                bufferEl.height += bs;
                bufferCtx.drawImage(preResizeCanvas, 0, bs);
                break;
        }
    });
}
