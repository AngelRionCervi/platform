import { getContext } from "../general/canvasRef.js";
import { gridProps } from "./Grid.js";
import camera from "../Camera/Camera.js";
import sceneBuffer from "../sceneObjects/SceneBuffer.js";
import gameObjectBuffer from "../gameObjects/GameObjectBuffer.js"
const sceneBufferCtx = sceneBuffer.getBufferCtx();
const gameObjectBufferCtx = gameObjectBuffer.getBufferCtx();

const bufferCtxs = {
    scene: sceneBufferCtx,
    gameObject: gameObjectBufferCtx,
}

const baseCtx = getContext();

export class Cell {
    constructor(id, x, y, absX, absY, blockType, prop) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.absX = absX;
        this.absY = absY;
        this.xOffset = 0;
        this.yOffset = 0;
        this.blockType = blockType;
        this.cellFillStyle = "white";
        this.lineWidth = 0.5;
        this.prop = prop;
        this.propRef = null;
        this.slice = { x: 0, y: 0 };
        this.addedBlockW = 0;
        this.addedBlockH = 0;
        this.tx = () => Math.floor((this.x + this.xOffset) * camera.getZoom());
        this.ty = () => Math.floor((this.y + this.yOffset) * camera.getZoom());
    }

    getID() {
        return this.id;
    }

    getCoords() {
        return { x: this.x, y: this.y };
    }

    setBlockAddedSize({w, h}) {
        this.addedBlockW = w;
        this.addedBlockH = h;
    }

    setBlockAddedW(number) {
        this.addedBlockW = number;
    }

    setBlockAddedH(number) {
        this.addedBlockH = number;
    }

    setCoords(x, y) {
        this.x = x;
        this.y = y;
    }

    setOffsets(x, y) {
        this.xOffset = x;
        this.yOffset = y;
    }

    setOffsetX(offset) {
        this.xOffset = offset;
    }

    setOffsetY(offset) {
        this.yOffset = offset;
    }

    setBlockType(type) {
        this.blockType = type;
        return this;
    }

    clearBufferCell(bufferType) {
        const ctx = bufferCtxs[bufferType];
        const blockSize = gridProps.getBlockSize();
        this.cellFillStyle = "white";
        ctx.clearRect(
            this.x - this.addedBlockW,
            this.y - this.addedBlockH,
            blockSize + this.addedBlockW,
            blockSize + this.addedBlockH
        );
        ctx.fillStyle = this.cellFillStyle;
        this.removeProp();
        return this;
    }

    removeProp() {
        this.prop = null;
        return this;
    }

    reset(ctx = null) {
        this.clear(ctx);
        this.removeProp();
        this.removePropRef();
        return this;
    }

    /*fillCell(context = null) {
        const ctx = context ? context : baseCtx;
        const blockSize = gridProps.getBlockSize();
        const zoom = camera.getZoom();
        ctx.imageSmoothingEnabled = false;
        ctx.globalCompositeOperation = "source-over";
        if (this.blockType === "air") {
            this.reset(ctx);
        } else if (this.prop && this.prop.obj && this.slice) {
            this.clear(ctx);
            const asset = this.prop.obj.getAsset();
            const sprite = asset.getSprite();
            ctx.beginPath();
            ctx.drawImage(
                sprite,
                this.slice.x,
                this.slice.y,
                blockSize,
                blockSize,
                this.tx() - this.addedBlockW,
                this.ty() - this.addedBlockH,
                Math.floor(blockSize * zoom) + this.addedBlockW,
                Math.floor(blockSize * zoom) + this.addedBlockH
            );
            ctx.closePath();
        }
        return this;
    }*/

    fillBufferCell(bufferType) {
        const ctx = bufferCtxs[bufferType];
        const blockSize = gridProps.getBlockSize();
        ctx.imageSmoothingEnabled = false;
        ctx.globalCompositeOperation = "source-over";
        if (this.prop && this.prop.obj && this.slice) {
            const asset = this.prop.obj.getAsset();
            const sprite = asset.getSprite();
            ctx.beginPath();
            ctx.drawImage(
                sprite,
                this.slice.x,
                this.slice.y,
                blockSize,
                blockSize,
                this.x - this.addedBlockW,
                this.y - this.addedBlockH,
                blockSize + this.addedBlockW,
                blockSize + this.addedBlockH
            );
            ctx.closePath();
        }
        return this;
    }

    setProp(prop) {
        this.prop = prop;
        return this;
    }

    setGameObject(gameObject) {
        this.gameObject = gameObject;
        return this;
    }

    setSlice(slice) {
        this.slice = slice;
        return this;
    }

    setGameObjectSlice(gameObjectSlice) {
        this.gameObjectSlice = gameObjectSlice;
        return this;
    }

    setPropRef(ref) {
        this.propRef = ref;
        return this;
    }

    removePropRef() {
        this.propRef = null;
        return this;
    }

    getPropRef() {
        return this.propRef;
    }

    getProp() {
        return this.prop;
    }

    isProp() {
        return !!this.prop;
    }

    isPropRef() {
        return !!this.propRef;
    }

    getPropFromRef() {
        return gridProps
            .getCoords()
            .flat()
            .find((el) => el?.prop?.obj && el.prop.obj.getID() === this.getPropRef())?.prop;
    }

    moveRight(times) {
        const blockSize = gridProps.getBlockSize();
        for (let u = 0; u < times; u++) {
            const coords = this.getCoords();
            this.setCoords(coords.x + blockSize, coords.y);
        }
    }

    moveLeft(times) {
        const blockSize = gridProps.getBlockSize();
        for (let u = 0; u < times; u++) {
            const coords = this.getCoords();
            this.setCoords(coords.x - blockSize, coords.y);
        }
    }

    moveDown(times) {
        const blockSize = gridProps.getBlockSize();
        for (let u = 0; u < times; u++) {
            const coords = this.getCoords();
            this.setCoords(coords.x, coords.y + blockSize);
        }
    }

    moveUp(times) {
        const blockSize = gridProps.getBlockSize();
        for (let u = 0; u < times; u++) {
            const coords = this.getCoords();
            this.setCoords(coords.x, coords.y - blockSize);
        }
    }
}
