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

    set(coord, texture = null) {
        const camCoord = camera.getCoords();
        if (!texture) {
            texture = this.createIconTexture(ts(gridProps.getBlockSize()));
        } 
        const sprite = new PIXI.Sprite(texture);
        sprite.position.set(ts(camCoord.x + coord.x), ts(camCoord.y + coord.y));
        collisionContainer.addChild(sprite);
    }

    rebuild() {
        collisionContainer.removeChildren();
        const texture = this.createIconTexture(ts(gridProps.getBlockSize()));
        this.boxes.forEach((box) => {
            this.set({ x: box.x, y: box.y }, texture);
        });
    }

    addBox(coord) {
        if (!this.boxes.find((box) => box.x === coord.x && box.y === coord.y)) {
            const box = { x: coord.x, y: coord.y };
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
