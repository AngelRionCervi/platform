import * as helper from "../../lib/helpers.js";
import { _G } from "../general/globals.js";

export class SceneObject {
    constructor(coord, asset, slice) {
        this.asset = asset;
        this.slice = slice;
        this.cells = null;
        this.coord = {
            x: coord.x,
            y: coord.y,
        };
        this.id = "so_" + asset.getID() + "_" + helper.uniqid();
    }

    setCells(cells) {
        this.cells = cells;
        return this;
    }

    getCells() {
        return this.cells;
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
