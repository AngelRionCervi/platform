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
    }

    setAsset(prop) {
        this.prop = prop;
    }

    resetCell() {
        this.cellFillStyle = "white";
        this.ctx.beginPath();
        this.ctx.rect(this.tx() + 1, this.ty() + 1, this.blockSize - 1, this.blockSize - 1);
        this.ctx.fillStyle = this.cellFillStyle;
        this.ctx.fill();
        this.ctx.closePath();
    }

    fillCell() {
        this.ctx.imageSmoothingEnabled = false;
        const x = this.tx();
        const y = this.ty();

        this.ctx.beginPath();
        this.ctx.moveTo(this.lineWidth + x, this.lineWidth + y);
        this.ctx.lineTo(this.lineWidth + x + this.blockSize, this.lineWidth + y);
        this.ctx.lineTo(this.lineWidth + x + this.blockSize, this.lineWidth + y + this.blockSize);

        if (this.prop && this.prop.type === "gameObject") {
            this.ctx.strokeStyle = "red";
        } else {
            this.ctx.strokeStyle = "black";
        }
        this.ctx.stroke();
        this.ctx.closePath();

        if (this.blockType === "air") {
            this.resetCell();
        } else if (this.prop) {
            this.resetCell();
            const sprite = this.prop.obj.getAsset().getSprite();
            this.ctx.beginPath();
            this.ctx.drawImage(sprite, x, y);
            this.ctx.closePath();
        }
    }

    getObject() {
        return this.prop;
    }
}
