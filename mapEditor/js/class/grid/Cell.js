export class Cell {
    constructor(ctx, id, x, y, blockType, blockSize, asset) {
        this.ctx = ctx;
        this.id = id;
        this.x = x;
        this.y = y;
        this.blockType = blockType;
        this.blockSize = blockSize;
        this.cellFillStyle = 'white';
        this.lineWidth = 0.5;
        this.asset = asset;
    }

    getCoords() {
        return { x: this.x, y: this.y };
    }

    setBlockType(type) {
        this.blockType = type;
    }

    setAsset(asset) {
        this.asset = asset;
    }

    fillCell() {
        this.ctx.imageSmoothingEnabled = false;

        this.ctx.beginPath();
        this.ctx.moveTo(this.lineWidth + this.x, this.lineWidth + this.y);
        this.ctx.lineTo(this.lineWidth + this.x + this.blockSize, this.lineWidth + this.y);
        this.ctx.lineTo(this.lineWidth + this.x + this.blockSize, this.lineWidth + this.y + this.blockSize);
        this.ctx.strokeStyle = "black";
        this.ctx.stroke();
        this.ctx.closePath();

        if (this.blockType === 'air') {
          
            this.cellFillStyle = "white"
            this.ctx.beginPath();
            this.ctx.rect(this.x + 1, this.y + 1, this.blockSize - 1, this.blockSize - 1);
            this.ctx.fillStyle = this.cellFillStyle;
            this.ctx.fill();
            this.ctx.closePath();
        }
        else if (this.asset) {
            const image = new Image();
            image.src = this.asset.path;
            image.onload = () => {
                this.ctx.beginPath();
                this.ctx.drawImage(image, this.x, this.y);
                this.ctx.closePath();
            }
        }
    }

}