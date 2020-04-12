import { SceneObject } from "./SceneObject.js";
import * as helper from "../../lib/helpers.js";
import { _GLOBALS_ } from "../../lib/globals.js";

export class SceneObjectList {
    constructor(interaction) {
        this.interaction = interaction;
        this.sceneObjects = [];
    }

    addSceneObject(coord, asset) {
        const curSceneObject = this.getByCoord(coord);
        let sceneObject = null;
        if (!curSceneObject) {
            sceneObject = new SceneObject(coord, asset);
        } else if (curSceneObject && curSceneObject.asset.getID() !== asset.id) {
            this.removeSceneObject(curSceneObject.getID());
            sceneObject = new SceneObject(coord, asset);
        } else {
            return false;
        }

        this.sceneObjects.push(sceneObject);
        return sceneObject;
    }

    removeSceneObject(id) {
        const curIds = this.sceneObjects.map((el) => el.getID());
        const index = curIds.indexOf(id);

        if (index !== -1) {
            this.sceneObjects.splice(index, 1);
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
