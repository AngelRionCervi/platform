import { SceneObject } from "./SceneObject.js";
import * as helper from "../../lib/helpers.js";
import { _GLOBALS_ } from "../../lib/globals.js";

export class SceneObjectList {
    constructor(interaction) {
        this.interaction = interaction;
        this.sceneObjects = [];
    }

    addSceneObject(coord, asset) {
        const sceneObject = new SceneObject(coord, asset);
        this.sceneObjects.push(sceneObject);
        console.log(this.sceneObjects)
        return sceneObject
    }

    removeSceneObject(id) {
        const curIDs = this.sceneObjects.map((el) => el.getID());
        const index = curIDs.indexOf(id);

        if (index !== -1) {
            this.sceneObjects.splice(index, 1);
            return true;
        } else {
            return false;
        }
    }

    getAllIDs() {
        return this.sceneObjects.map((el) => el.id);
    }

    getByCoord(coord) {
        const x = helper.roundToPrevMult(coord.x, _GLOBALS_.blockSize);
        const y = helper.roundToPrevMult(coord.y, _GLOBALS_.blockSize);
        return this.sceneObjects.find((el) => x === el.coord.x && y === el.coord.y);
    }
}
