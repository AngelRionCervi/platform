import gridProps from "../editor/grid/GridProps.js";
import camera from "../camera/Camera.js";
import * as _H from "../../lib/helpers.js";
import { sceneContainer, entityContainer } from "../general/canvasRef.js";

class CanvasBuffer {
    constructor() {
        //this.buffer = document.createElement("canvas");
    }
    /*
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
    updateBuffer(cell, object, slice, sliceSize, type) {
        if (type === "sceneObject") {
            cell.setBlockType("wall")
                .setProp(object)
                .setSceneObjectSlice(slice)
                .setRealSliceSize(sliceSize)
                .fillBufferCell();
        } else if (type === "gameObject") {
            //cell.setBlockType("wall").setGameObject(object);
        }
    }*/
    update(coord, asset, slice = null) {
        if (slice) {
            const blockSize = gridProps.getBlockSize();

            const xSlice = Math.floor(slice.sx - slice.sx * (asset.trueWidth / asset.width - 1));
            const ySlice = Math.floor(slice.sy - slice.sy * (asset.trueHeight / asset.height - 1));

            const trim = new PIXI.Rectangle(xSlice, ySlice, blockSize, blockSize);
            const texture = new PIXI.Texture(asset.texture.baseTexture, trim);
            const sprite = new PIXI.Sprite(texture);

            sprite.position.set(slice.x, slice.y);
            sprite.width = blockSize;
            sprite.height = blockSize;
            sceneContainer.addChild(sprite);
        } else {
            const sprite = new PIXI.Sprite(asset.texture);
            sprite.position.set(coord.x, coord.y);
            sprite.width = asset.trueWidth;
            sprite.height = asset.trueHeight;
            sceneContainer.addChild(sprite);
        }
    }
    /*
    clearTile(coord, blockSize) {
        this.setFillStyle("white");
        this.getBufferCtx().fillRect(coord.x, coord.y, blockSize, blockSize);
    }
    setFillStyle(style) {
        this.getBufferCtx().fillStyle = style;
    }
    getBuffer() {
        return this.buffer;
    }
    getBufferCtx() {
        return this.getBuffer().getContext("2d");
    }*/
}

export const sceneBuffer = new CanvasBuffer();

class GameObjectBufferList {
    constructor() {
        this.list = [];
    }

    add(gObj, coord) {
        const defaultAsset = gObj.getDefaultAsset();
        const showObjID = gObj.getUniqID();

        const id = _H.uniqid("b");

        const sprite = new PIXI.AnimatedSprite(gObj.frames.map((el) => el.texture));
        sprite.position.set(coord.x, coord.y);
        sprite.width = defaultAsset.trueWidth;
        sprite.height = defaultAsset.trueHeight;
        entityContainer.addChild(sprite);
        this.list.push({ id, sprite, showObjID, coord, defaultAsset, index: this.list.length });
        return id;
    }

    remove(id) {
        this.list.splice(this.list.map((el) => el.id).indexOf(id), 1);
    }

    getBufferByCoord(coord) {
        const tw = camera.toWorld.bind(camera);
        const camCoord = camera.getCoords();
        const wCoord = { x: tw(coord.x), y: tw(coord.y) };
        let buffer = null;
        for (let u = 0; u < this.list.length; u++) {
            const bufferCoord = this.list[u].coord;
            const assetW = this.list[u].defaultAsset.trueWidth;
            const assetH = this.list[u].defaultAsset.trueHeight;
            if (
                wCoord.x >= bufferCoord.x + tw(camCoord.x) &&
                wCoord.x <= bufferCoord.x + tw(camCoord.x) + assetW &&
                wCoord.y >= bufferCoord.y + tw(camCoord.y) &&
                wCoord.y <= bufferCoord.y + tw(camCoord.y) + assetH
            ) {
                if (!buffer || buffer.index < this.list[u].index) {
                    buffer = this.list[u];
                }
            }
        }
        return buffer;
    }

    setCoord(id, coord) {
        const buffer = this.list.find((el) => el.id === id);
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
