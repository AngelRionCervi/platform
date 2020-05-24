import * as _H from "../../lib/helpers.js";

export class GameObject {
    constructor(asset) {
        this.asset = asset;
        this.id = "o_" + _H.uniqid() + '_' + this.asset.getID();
    }

    getFileName() {
        return this.asset.getFileName();
    }

    getID() {
        return this.id;
    }

    getAsset() {
        return this.asset;
    }
}