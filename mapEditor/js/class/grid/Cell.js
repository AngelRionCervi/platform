export class Cell {
    constructor(ctx, id, x, y, blockType, blockSize, prop) {
        this.ctx = ctx;
        this.id = id;
        this.x = x;
        this.y = y;
        this.blockType = blockType;
        this.blockSize = blockSize;
        this.cellFillStyle = "white";
        this.lineWidth = 0.5;
        this.prop = prop;
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
        this.ctx.rect(this.x + 1, this.y + 1, this.blockSize - 1, this.blockSize - 1);
        this.ctx.fillStyle = this.cellFillStyle;
        this.ctx.fill();
        this.ctx.closePath();
    }

    fillCell() {
        this.ctx.imageSmoothingEnabled = false;

        this.ctx.beginPath();
        this.ctx.moveTo(this.lineWidth + this.x, this.lineWidth + this.y);
        this.ctx.lineTo(this.lineWidth + this.x + this.blockSize, this.lineWidth + this.y);
        this.ctx.lineTo(this.lineWidth + this.x + this.blockSize, this.lineWidth + this.y + this.blockSize);

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
            this.ctx.drawImage(sprite, this.x, this.y);
            this.ctx.closePath();
        }
    }

    getObject() {
        return this.prop;
    }
}
