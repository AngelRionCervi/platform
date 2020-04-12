import * as helper from "../../lib/helpers.js";
import { _GLOBALS_ } from "../../lib/globals.js";

export class SceneObject {
    constructor(coord, asset) {
        this.asset = asset;
        this.coord = {
            x: helper.roundToPrevMult(coord.x, _GLOBALS_.blockSize),
            y: helper.roundToPrevMult(coord.y, _GLOBALS_.blockSize),
        };
        this.id = "so_" + asset.getID() + "_" + helper.uniqid();
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
