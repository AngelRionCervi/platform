import * as helper from "../../lib/helpers.js";

export class GameObject {
    constructor(asset) {
        this.asset = asset;
        this.id = "o_" + helper.uniqid() + '_' + this.asset.getID();
        this.cells = null;
    }

    setCells(cells) {
        this.cells = cells;
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