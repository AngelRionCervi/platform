export class Cell {
    constructor(ctx, id, x, y, blockType, blockSize) {
        this.ctx = ctx;
        this.id = id;
        this.x = x;
        this.y = y;
        this.blockType = blockType;
        this.blockSize = blockSize;
        this.cellFillStyle = 'white';
    }

    getCoords() {
        return { x: this.x, y: this.y };
    }

    setBlockType(type) {
        this.blockType = type;
    }

    fillCell(asset = null) {
        this.ctx.imageSmoothingEnabled = false;
        if (!asset) {
            if (this.blockType === "wall") {
                this.cellFillStyle = "black"
            }
            if (this.blockType === "air") {
                this.cellFillStyle = "white"
            }
            this.ctx.beginPath();
            this.ctx.rect(this.x + 1, this.y + 1, this.blockSize - 1, this.blockSize - 1);
            this.ctx.fillStyle = this.cellFillStyle;
            this.ctx.fill();
            this.ctx.closePath();
        }
        else {
            const image = new Image();
            image.src = asset.path;
            image.onload = () => {
                this.ctx.beginPath();
                this.ctx.drawImage(image, this.x + 1, this.y + 1);
                this.ctx.closePath();
            }
            
        }
    }
}