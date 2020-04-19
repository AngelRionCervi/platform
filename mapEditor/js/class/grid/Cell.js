export class Cell {
    constructor(ctx, id, x, y, absX, absY, blockType, blockSize, prop) {
        this.ctx = ctx;
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

    setBlockType(type) {
        this.blockType = type;
        return this;
    }

    clear() {
        this.cellFillStyle = "white";
        this.ctx.beginPath();
        this.ctx.rect(this.tx(), this.ty(), this.blockSize, this.blockSize);
        this.ctx.fillStyle = this.cellFillStyle;
        this.ctx.fill();
        this.ctx.closePath();
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
        this.ctx.imageSmoothingEnabled = false;
        const x = this.tx();
        const y = this.ty();

        if (this.blockType === "air") {
            this.reset();
        } else if (this.prop && this.prop.obj) {
            this.clear();
            const sprite = this.prop.obj.getAsset().getSprite();
            this.ctx.beginPath();
            this.ctx.drawImage(sprite, x, y);
            this.ctx.closePath();
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
        console.log(this.prop)
        return !!this.prop;
    }
}
