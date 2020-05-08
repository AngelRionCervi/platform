import { getContext } from "../general/canvasRef.js";
import { gridProps, camera } from "./Grid.js";

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

    clear() {
        const blockSize = gridProps.getBlockSize();
        const zoom = camera.getZoom();
        this.cellFillStyle = "white";
        ctx.clearRect(
            this.tx() - this.addedBlockW,
            this.ty() - this.addedBlockH,
            Math.floor(blockSize * zoom) + this.addedBlockW,
            Math.floor(blockSize * zoom) + this.addedBlockH
        );
        ctx.fillStyle = this.cellFillStyle;
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
        const zoom = camera.getZoom();
        ctx.imageSmoothingEnabled = false;
        ctx.globalCompositeOperation = "source-over";

        if (this.blockType === "air") {
            this.reset();
        } else if (this.prop && this.prop.obj && this.slice) {
            this.clear();
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
    }

    setProp(prop) {
        this.prop = prop;
        return this;
    }

    setSlice(slice) {
        this.slice = slice;
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
