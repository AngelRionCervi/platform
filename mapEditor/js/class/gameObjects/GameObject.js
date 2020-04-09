import * as helper from "../../lib/helpers.js";

export class GameObject {
    constructor(path, name, id) {
        this.spritePath = path;
        this.fileName = name;
        this.assetID = id;
        this.id = "o_" + helper.uniqid() + '_' + this.assetID;
    }

    getSpritePath() {
        return this.spritePath;
    }

    getID() {
        return this.id;
    }

    getFileName() {
        return this.fileName;
    }
}