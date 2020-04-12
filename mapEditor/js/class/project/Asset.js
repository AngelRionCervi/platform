export class Asset {
    constructor() {
        this.sprite;
        this.name;
        this.path;
        this.id;
        this.isPrep = false;
    }

    async build(info) {
        this.sprite = await this.imageProcess(info.path);
        this.path = info.path;
        this.name = info.name;
        this.folder = info.folder;
        this.id = info.id;
        this.isPrep = true;
    }

    async imageProcess(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
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
}
