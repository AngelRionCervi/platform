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
        const { sprite, width, height } = await this.loadImage(info.path);
        this.sprite = sprite;
        this.width = width;
        this.height = height;
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
                resolve({ sprite: buffer, width: buffer.width, height: buffer.height });
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
