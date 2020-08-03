import gridProps from "../grid/GridProps.js";
import { _G } from "../../general/globals.js";
import { collisionContainer } from "../../general/canvasRef.js";

export default class CollisionBox {
    constructor() {
        this.iconColor = _G.iconColor;
        this.boxes = [];
        this.texture = this.createIconTexture(gridProps.getBlockSize());
    }

    createIconTexture(size) {
        const iconBuffer = document.createElement("canvas");
        const ctx = iconBuffer.getContext("2d");
        iconBuffer.width = size;
        iconBuffer.height = size;
        ctx.fillStyle = this.iconColor;
        ctx.fillRect(0, 0, size, size);
        return new PIXI.Texture.from(iconBuffer);
    }

    render(box) {
        const coord = box.cell.getCoords();
        const sprite = new PIXI.Sprite(this.texture);
        const trueBS = gridProps.getBlockSize();
        sprite.position.set(coord.x, coord.y);
        sprite.width = trueBS;
        sprite.height = trueBS;
        collisionContainer.addChild(sprite);
    }

    rebuild() {
        collisionContainer.removeChildren();
        this.boxes.forEach((box) => {
            this.render(box);
        });
    }

    addBox(coord, cell) {
        if (!this.boxes.find((box) => box.x === coord.x && box.y === coord.y)) {
            const box = { x: coord.x, y: coord.y, cell };
            this.boxes.push(box);
            return box;
        }
        return false;
    }

    removeBox(coord) {
        const boxIndex = this.boxes.findIndex((box) => box.x === coord.x && box.y === coord.y);
        if (boxIndex !== -1) {
            this.boxes.splice(boxIndex, 1);
            return true;
        }
        return false;
    }

    getBoxes() {
        return this.boxes;
    }
}
