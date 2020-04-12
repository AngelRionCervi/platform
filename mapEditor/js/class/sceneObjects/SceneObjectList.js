import { SceneObject } from "./SceneObject.js";
import * as helper from "../../lib/helpers.js";

export class SceneObjectList {
    constructor(interaction) {
        this.interaction = interaction;
        this.sceneObjects = [];
    }

    addSceneObject(coord, asset) {
        const curSceneObject = this.getByCoord(coord);
        console.log(curSceneObject, this.sceneObjects);
        if (!curSceneObject) {
            const sceneObject = new SceneObject(coord, asset);
            this.sceneObjects.push(sceneObject);
        } else if (curSceneObject && curSceneObject.id.split("_").pop() !== asset.id) {
            this.removeSceneObject(curSceneObject.id);
            const sceneObject = new SceneObject(coord, asset);
            this.sceneObjects.push(sceneObject);
        }
    }

    removeSceneObject(id) {
        const curIds = this.sceneObjects.map((el) => el.getID());
        this.sceneObjects.splice(curIds.indexOf(id), 1);
    }

    getAllIDs() {
        return this.sceneObjects.map((el) => el.id);
    }

    getByCoord(coord) {
        return this.sceneObjects.find(
            (el) =>
                helper.roundToPrevMult(coord.x, 32) === el.coord.x && helper.roundToPrevMult(coord.y, 32) === el.coord.y
        );
    }
}
