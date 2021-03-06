import { GameObject } from "/mapEditor/js/class/gameObjects/GameObject.js";
import { ShowGameObject } from "/mapEditor/js/class/gameObjects/ShowGameObject.js";
import { DomBuilder } from "../../lib/DomBuilder.js";
import * as helper from "../../lib/helpers.js";
import camera from "../camera/Camera.js";
import gridProps from "../editor/grid/GridProps.js";
import layout from "../editor/EditorLayout.js";
import GameObjectConfig from "./GameObjectConfig.js";
const dob = new DomBuilder();

export class GameObjectList {
    constructor(interaction) {
        this.interaction = interaction;
        this.listContainer = document.getElementById("game_objects_container");
        this.listWindow = justAnotherWin.add({
            x: layout.entities.x,
            y: layout.entities.y,
            width: layout.entities.width,
            height: layout.entities.height,
            name: "entitiesWindow"
        }, this.listContainer);
        this.prevObjectsIDs = [];
        this.curDisplayed = [];
        this.gameObjects = [];
        this.curSelectedID = null;
    }

    addGameObject(asset) {
        const object = new GameObject(asset);

        this.gameObjects.push(object);
        this.updateDomList();
    }

    addGameObjectToScene(coord, id) {
        const curGameObject = this.getByID(this.curSelectedID);
        const curShowGameObject = this.getByCoord(coord);
        const choseObj = this.getByID(id);

        let gameObjectShow = null;
        if (!curShowGameObject) {
            gameObjectShow = new ShowGameObject(id, choseObj.getDefaultAsset(), coord);
        } else if (curShowGameObject && curGameObject.getID() !== id) {
            this.removeShowGameObject(curShowGameObject.getUniqID());
            gameObjectShow = new ShowGameObject(id, choseObj.getDefaultAsset(), coord);
        } else {
            return false;
        }

        this.curDisplayed.push(gameObjectShow);
        return gameObjectShow;
    }

    removeShowGameObject(id) {
        const curIDs = this.curDisplayed.map((el) => el.getUniqID());
        const index = curIDs.indexOf(id);
        if (index !== -1) {
            this.curDisplayed.splice(index, 1);
            console.log("currently displayed gameObjects: " + this.curDisplayed.length);
            return true;
        } else {
            return false;
        }
    }

    removeObject(id) {
        const curIds = this.gameObjects.map((el) => el.getID());
        this.gameObjects.splice(curIds.indexOf(id), 1);
        this.updateDomList();
    }

    updateDomList() {
        const currentIDs = this.gameObjects.map((el) => el.id);
        const prevIDs = this.prevObjectsIDs;

        const toAdd = currentIDs.filter((el) => !prevIDs.includes(el));
        const toRemove = prevIDs.filter((el) => !currentIDs.includes(el));

        toAdd.forEach((id) => {
            this.buildDomNode(this.getByID(id));
        });
        toRemove.forEach((id) => {
            this.removeDomNode(id);
        });

        this.prevObjectsIDs = this.gameObjects.map((el) => el.id);
    }

    buildDomNode(object) {
        let name = object.getFileName();
        if (name.length > 20) {
            name = name.slice(0, 20) + "...";
        }
        const nameNode = dob.createNode("div", "game-object-name", null, name).done();
        const imageNode = dob.createNode("img", "game-object-img").done();
        imageNode.src = object.getDefaultAsset().getSpritePath();
        const leftListener = {
            type: "click",
            callback: this.interaction.handleGameObjectClick.bind(this.interaction),
            args: [object],
        };
        const contextListener = {
            type: "contextmenu",
            callback: this.interaction.handleGameObjectContextClick.bind(this.interaction),
            args: [object],
        };
        const objectEl = dob
            .createNode(
                "div",
                "game-object-cell",
                "go_" + object.getID(),
                [imageNode, nameNode],
                [leftListener, contextListener]
            )
            .done();
        this.listContainer.appendChild(objectEl);
    }

    removeDomNode(id) {
        const el = document.getElementById("go_" + id);
        el.remove();
    }

    selectObject(object) {
        if (this.curSelectedID !== object.getID()) {
            this.curSelectedID = object.getID();
        }
    }

    isAnObjectSelected() {
        return this.curSelectedID ? true : false;
    }

    styleDomNode(target) {
        while (!target.classList.contains("game-object-cell")) {
            target = target.parentElement;
        }
        this.removeSelectedStyle();
        target.classList.add("game-object-cell-target");
    }

    removeSelectedStyle() {
        Array.from(document.getElementsByClassName("game-object-cell-target")).forEach((cell) => {
            cell.classList.remove("game-object-cell-target");
        });
    }

    resetSelection() {
        this.curSelectedID = null;
        this.removeSelectedStyle();
    }

    getCurrentObjectID() {
        return this.curSelectedID;
    }

    getByID(id) {
        return this.gameObjects.find((el) => el.id === id);
    }

    getAllIDs() {
        return this.gameObjects.map((el) => el.id);
    }

    getByCoord(coords) {
        const zoom = camera.getZoom();
        const x = helper.roundToPrevMult(Math.round(coords.x / zoom - camera.x), gridProps.getBlockSize());
        const y = helper.roundToPrevMult(Math.round(coords.y / zoom - camera.y), gridProps.getBlockSize());
        return this.curDisplayed.find((el) => x === el.coord.x && y === el.coord.y);
    }

    getCurDisplayed() {
        return this.curDisplayed;
    }

    createConfigWindow(gameObject) {
        const config = GameObjectConfig(gameObject);
    }
}
