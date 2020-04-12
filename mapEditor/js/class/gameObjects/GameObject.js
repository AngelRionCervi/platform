import * as helper from "../../lib/helpers.js";

export class GameObject {
    constructor(asset) {
        this.asset = asset;
        this.id = "o_" + helper.uniqid() + '_' + this.assetID;
    }

    getSprite() {
        return this.asset.getSprite();
    }

    getSpritePath() {
        return this.asset.getSpritePath();
    }

    getFileName() {
        return this.asset.getFileName();
    }

    getID() {
        return this.id;
    }
}