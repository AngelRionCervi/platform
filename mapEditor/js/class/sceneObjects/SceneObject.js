import * as helper from "../../lib/helpers.js";
import { _G } from "../../lib/globals.js";

export class SceneObject {
    constructor(coord, asset) {
        this.asset = asset;
        this.coord = {
            x: helper.roundToPrevMult(coord.x, _G.blockSize),
            y: helper.roundToPrevMult(coord.y, _G.blockSize),
        };
        this.id = "so_" + asset.getID() + "_" + helper.uniqid();
    }

    getID() {
        return this.id;
    }

    getCoord() {
        return this.coord;
    }

    getAsset() {
        return this.asset;
    }
}
