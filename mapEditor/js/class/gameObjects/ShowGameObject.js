import { GameObject } from "./GameObject.js";
import { _G } from "../../lib/globals.js";
import * as helper from "../../lib/helpers.js";

export class ShowGameObject {
    constructor(goID, asset, coord) {
        this.asset = asset;
        this.coord = {
            x: helper.roundToPrevMult(coord.x, _G.blockSize),
            y: helper.roundToPrevMult(coord.y, _G.blockSize),
        };
        this.goID = goID;
        this.uniqid = "ou_" + helper.uniqid();
    }

    getUniqID() {
        return this.uniqid;
    }

    getAsset() {
        return this.asset;
    }
}
