import { getContext } from "../general/canvasRef.js";
import { gridProps } from "./Grid.js";

const ctx = getContext();

export class Cell {
    constructor(id, x, y, absX, absY, blockType, blockSize, prop) {
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
        this.tx = () => this.x + this.xOffset;
        this.ty = () => this.y + this.yOffset;
    }

    getCoords() {
        return { x: this.x, y: this.y };
    }

    setCoords(x, y) {
        this.x = x;
        this.y = y;
    }

    setOffsets(x, y) {
        this.xOffset = x;
        this.yOffset = y;
    }

    setBlockType(type) {
        this.blockType = type;
        return this;
    }

    clear() {
        const blockSize = gridProps.getBlockSize();
        this.cellFillStyle = "white";
        ctx.beginPath();
        ctx.rect(this.tx(), this.ty(), blockSize, blockSize);
        ctx.fillStyle = this.cellFillStyle;
        ctx.fill();
        ctx.closePath();
        return this;
    }

    removeProp() {
        this.prop = null;
        return this;
    }

    reset() {
        this.clear();
        this.removeProp();
        return this;
    }

    fillCell() {
        const blockSize = gridProps.getBlockSize();
        ctx.imageSmoothingEnabled = false;
        const x = this.tx();
        const y = this.ty();

        if (this.blockType === "air") {
            this.reset();
        } else if (this.prop && this.prop.obj) {
            this.clear();
            const sprite = this.prop.obj.getAsset().getSprite();
            ctx.beginPath();
            ctx.drawImage(sprite, x, y, blockSize, blockSize);
            ctx.closePath();
        }
        return this;
    }

    setObject(prop) {
        this.prop = prop;
        return this;
    }

    getObject() {
        return this.prop;
    }

    isProp() {
        return !!this.prop;
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
