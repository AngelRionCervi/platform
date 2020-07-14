import * as _H from "../../lib/helpers.js";
import gridProps from "../editor/GridProps.js";

export class Asset {
    constructor() {
        this.sprite;
        this.name;
        this.path;
        this.id;
        this.width;
        this.height;
        this.isPrep = false;
    }

    async build(info) {
        const { sprite, width, height, pixiSprite, texture } = await this.loadImage(info.path);
        const blockSize = gridProps.getBlockSize();
        this.sprite = sprite;
        this.pixiSprite = pixiSprite;
        this.texture = texture;
        this.width = width;
        this.height = height;
        this.trueWidth = _H.roundToNearestMult(width, blockSize);
        this.trueHeight = _H.roundToNearestMult(height, blockSize);
        this.path = info.path;
        this.name = info.name;
        this.folder = info.folder;
        this.id = info.id;
        this.isPrep = true;
    }

    async loadImage(src) {
        return new Promise((resolve) => {
            const buffer = document.createElement("canvas");
            const image = new Image();
            image.src = src;
            image.addEventListener("load", () => {
                buffer.width = image.naturalWidth;
                buffer.height = image.naturalHeight;
                buffer.getContext("2d").drawImage(image, 0, 0);
                const texture = PIXI.Texture.from(image);
                const sprite = new PIXI.Sprite(texture);
                resolve({ sprite: buffer, texture: texture, pixiSprite: sprite, width: buffer.width, height: buffer.height });
            });
        });
    }

    getID() {
        return this.id;
    }

    getFileName() {
        return this.name;
    }

    getSpritePath() {
        return this.path;
    }

    getSprite() {
        return this.sprite;
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }
}
