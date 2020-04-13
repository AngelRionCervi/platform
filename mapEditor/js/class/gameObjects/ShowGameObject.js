import { GameObject } from "./GameObject.js";
import { _GLOBALS_ } from "../../lib/globals.js";
import * as helper from "../../lib/helpers.js";

export class ShowGameObject {
    constructor(goID, asset, coord) {
        this.asset = asset;
        this.coord = {
            x: helper.roundToPrevMult(coord.x, _GLOBALS_.blockSize),
            y: helper.roundToPrevMult(coord.y, _GLOBALS_.blockSize),
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
