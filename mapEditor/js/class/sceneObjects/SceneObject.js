import * as helper from "../../lib/helpers.js";

export class SceneObject {
    constructor(coord, asset) {
        this.asset = asset;
        this.coord = {x: helper.roundToPrevMult(coord.x, 32), y: helper.roundToPrevMult(coord.y, 32)};
        this.id = 's_' + asset.getID();
    }

    getID() {
        return this.id;
    }

    getSprite() {
        return this.asset.getSprite();
    }

    getCoord() {
        return this.coord;
    }
}