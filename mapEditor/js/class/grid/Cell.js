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
        this.propRef = null;
        this.tx = () => this.x + this.xOffset;
        this.ty = () => this.y + this.yOffset;
    }

    getID() {
        return this.id;
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
        this.removePropRef();
        return this;
    }

    fillCell() {
        const blockSize = gridProps.getBlockSize();
        ctx.imageSmoothingEnabled = false;

        if (this.blockType === "air") {
            this.reset();
        } else if (this.prop && this.prop.obj) {
            this.clear();

            const asset = this.prop.obj.getAsset();
            const sprite = asset.getSprite();
            const width = asset.getWidth();
            const height = asset.getHeight();
            ctx.beginPath();
            ctx.drawImage(sprite, this.tx(), this.ty(), width, height);
            ctx.closePath();
        }
        return this;
    }

    setProp(prop) {
        this.prop = prop;
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
            .find((el) => el?.prop?.obj && el.prop.obj.getID() === this.propRef)?.prop;
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
