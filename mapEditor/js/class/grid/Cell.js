import { getContext } from "../general/canvasRef.js";

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
        this.blockSize = blockSize;
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

    setBlockType(type) {
        this.blockType = type;
        return this;
    }

    clear() {
        this.cellFillStyle = "white";
        ctx.beginPath();
        ctx.rect(this.tx(), this.ty(), this.blockSize, this.blockSize);
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
        ctx.imageSmoothingEnabled = false;
        const x = this.tx();
        const y = this.ty();

        if (this.blockType === "air") {
            this.reset();
        } else if (this.prop && this.prop.obj) {
            this.clear();
            const sprite = this.prop.obj.getAsset().getSprite();
            ctx.beginPath();
            ctx.drawImage(sprite, x, y);
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
        for (let u = 0; u < times; u++) {
            const coords = this.getCoords();
            this.setCoords(coords.x + this.blockSize, coords.y);
        }
    }

    moveLeft(times) {
        for (let u = 0; u < times; u++) {
            const coords = this.getCoords();
            this.setCoords(coords.x - this.blockSize, coords.y);
        }
    }

    moveDown(times) {
        for (let u = 0; u < times; u++) {
            const coords = this.getCoords();
            this.setCoords(coords.x, coords.y + this.blockSize);
        }
    }

    moveUp(times) {
        for (let u = 0; u < times; u++) {
            const coords = this.getCoords();
            this.setCoords(coords.x, coords.y - this.blockSize);
        }
    }
}
