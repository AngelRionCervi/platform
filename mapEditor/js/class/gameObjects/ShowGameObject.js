import { GameObject } from "./GameObject.js";
import { _G } from "../general/globals.js";
import * as helper from "../../lib/helpers.js";

export class ShowGameObject {
    constructor(goID, asset, coord) {
        this.defaultAsset = asset;
        this.frames = [asset];
        this.coord = {
            x: helper.roundToPrevMult(coord.x, _G.blockSize),
            y: helper.roundToPrevMult(coord.y, _G.blockSize),
        };
        this.goID = goID;
        this.uniqid = "ou_" + helper.uniqid();
        this.cells = null;
    }

    setCells(cells) {
        this.cells = cells;
    }

    getCells() {
        return this.cells;
    }

    getUniqID() {
        return this.uniqid;
    }

    getDefaultAsset() {
        return this.defaultAsset;
    }
}
