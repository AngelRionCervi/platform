import gridProps from "./GridProps.js";
import camera from "../Camera/Camera.js";
import { _G } from "../general/globals.js";
import { app, collisionContainer } from "../general/canvasRef.js";

const { vpWidth, vpHeight } = camera.getViewPort();
const ts = camera.toScreen.bind(camera);
const tw = camera.toWorld.bind(camera);

//const collisionsSprite = new PIXI.Sprite();
//collisionContainer.addChild(collisionsSprite);

export default class CollisionBox {
    constructor() {
        this.buffer = document.createElement("canvas");
        this.ctx = this.buffer.getContext("2d");
        this.buffer.width = vpWidth;
        this.buffer.height = vpHeight;
        this.iconColor = _G.iconColor;
        this.boxes = [];
        this.texture = this.createIconTexture(ts(gridProps.getBlockSize()));
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
        const camCoord = camera.getCoords();
        const sprite = new PIXI.Sprite(this.texture);
        sprite.position.set(camCoord.x + ts(box.x) - 1, camCoord.y + ts(box.y) - 1);
        sprite.width = ts(gridProps.getBlockSize()) + 2;
        sprite.height = ts(gridProps.getBlockSize()) + 2;
        collisionContainer.addChild(sprite);
    }

    rebuild() {
        collisionContainer.removeChildren();
        this.boxes.forEach((box) => {
            this.render(box);
        });
    }

    addBox(coord, cellId) {
        if (!this.boxes.find((box) => box.cellId === cellId)) {
            const box = { x: coord.x, y: coord.y, cellId };
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
