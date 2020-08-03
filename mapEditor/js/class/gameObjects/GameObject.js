import * as _H from "../../lib/helpers.js";

export class GameObject {
    constructor(asset) {
        this.defaultAsset = asset;
        this.frames = [asset];
        this.name = asset.name;
        this.id = "o_" + _H.uniqid() + '_' + this.defaultAsset.getID();
    }

    getFileName() {
        return this.defaultAsset.getFileName();
    }

    getID() {
        return this.id;
    }

    getDefaultAsset() {
        return this.defaultAsset;
    }
}