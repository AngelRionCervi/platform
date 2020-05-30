import { SceneObject } from "./SceneObject.js";
import * as helper from "../../lib/helpers.js";
import { _G } from "../general/globals.js";

export class SceneObjectList {
    constructor(interaction) {
        this.interaction = interaction;
        this.sceneObjects = [];
    }

    addSceneObject(coord, asset, slice) {
        const sceneObject = new SceneObject(coord, asset, slice);
        this.sceneObjects.push(sceneObject);
        return sceneObject
    }

    removeSceneObject(id) {
        const curIDs = this.sceneObjects.map((el) => el.getID());
        const index = curIDs.indexOf(id);
       console.log(curIDs, id);
        if (index !== -1) {
            this.sceneObjects.splice(index, 1);
            console.log("currently displayed sceneObjects: " + this.sceneObjects.length);
            return true;
        } else {
            return false;
        }
    }

    getAllIDs() {
        return this.sceneObjects.map((el) => el.id);
    }

    getByCoord(coord) {
        const x = helper.roundToPrevMult(coord.x, _G.blockSize);
        const y = helper.roundToPrevMult(coord.y, _G.blockSize);
        return this.sceneObjects.find((el) => x === el.coord.x && y === el.coord.y);
    }
}
