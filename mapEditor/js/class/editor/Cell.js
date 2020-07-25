import gridProps from "./GridProps.js";
import camera from "../Camera/Camera.js";
import { sceneBuffer } from "../general/CanvasBuffer.js";

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
        this.sliceRealWidth = 0;
        this.sliceRealHeight = 0;
        this.layerList = [];
        this.collisionEnabled = false;
        this.tx = () => camera.toScreen(this.x) + camera.x;
        this.ty = () => camera.toScreen(this.y) + camera.y;
        //this.tx = () => Math.floor((this.x + this.xOffset) * camera.getZoom());
        //this.ty = () => Math.floor((this.y + this.yOffset) * camera.getZoom());
    }

    enableCollision() {
        this.collisionEnabled = true;
    }

    disableCollision() {
        this.collisionEnabled = false;
    }

    isCollisionEnabled() {
        return this.collisionEnabled;
    }

    getID() {
        return this.id;
    }

    getCoords() {
        return { x: this.x, y: this.y };
    }

    setRealSliceSize({ w, h }) {
        this.sliceRealWidth = w;
        this.sliceRealHeight = h;
        return this;
    }

    setBlockAddedSize({ w, h }) {
        this.addedBlockW = w;
        this.addedBlockH = h;
        return this;
    }

    setBlockAddedW(number) {
        this.addedBlockW = number;
        return this;
    }

    setBlockAddedH(number) {
        this.addedBlockH = number;
        return this;
    }

    setCoords(x, y) {
        const bs = gridProps.getBlockSize()
        this.x = x;
        this.y = y;
        this.absX = x / bs;
        this.absY = y / bs;
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

    clearBufferCell(clearProp = false) {
        const ctx = sceneBuffer.getBufferCtx();
        const blockSize = gridProps.getBlockSize();
        this.cellFillStyle = "white";
        ctx.clearRect(
            this.x - this.addedBlockW,
            this.y - this.addedBlockH,
            blockSize + this.addedBlockW,
            blockSize + this.addedBlockH
        );
        ctx.fillStyle = this.cellFillStyle;
        if (clearProp) {
            this.removeProp();
            this.removeGameObject();
        }
        return this;
    }

    removeProp() {
        this.prop = null;
        return this;
    }

    removeGameObject() {
        this.gameObject = null;
        return this;
    }

    reset(ctx = null) {
        this.clear(ctx);
        this.removeProp();
        this.removePropRef();
        return this;
    }

    fillBufferCell() {
        const ctx = sceneBuffer.getBufferCtx();
        const blockSize = gridProps.getBlockSize();
        const asset = this.prop.getAsset();
        const sprite = asset.getSprite();

        ctx.imageSmoothingEnabled = false;
        ctx.globalCompositeOperation = "source-over";
        this.clearBufferCell(false);
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
            blockSize + this.addedBlockH,
        );
        ctx.closePath();

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

    setSceneObjectSlice(slice) {
        this.slice = slice;
        return this;
    }

    getProp() {
        return this.prop;
    }

    getGameObject() {
        return this.gameObject;
    }

    isProp() {
        return !!this.prop;
    }

    isGameObject() {
        return !!this.gameObject;
    }

    getContent() {
        return (
            (this.isProp() || this.isGameObject()) && {
                prop: this.isProp() ? this.getProp() : null,
                gameObject: this.isGameObject() ? this.getGameObject() : null,
            }
        );
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
