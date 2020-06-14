import { GameObject } from "/mapEditor/js/class/gameObjects/GameObject.js";
import { ShowGameObject } from "/mapEditor/js/class/gameObjects/ShowGameObject.js";
import { DomBuilder } from "../../lib/DomBuilder.js";
import { _G } from "../general/globals.js";
import * as helper from "../../lib/helpers.js";
import camera from "../Camera/Camera.js";
const dob = new DomBuilder();

export class GameObjectList {
    constructor(interaction) {
        this.interaction = interaction;
        this.listContainer = document.getElementById("game_objects_container");
        this.listWindow = justAnotherWin.add({
            x: 100,
            y: window.innerHeight - 300,
            width: window.innerWidth - 200,
            height: 300,
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
            gameObjectShow = new ShowGameObject(id, choseObj.getAsset(), coord);
        } else if (curShowGameObject && curGameObject.getID() !== id) {
            this.removeShowGameObject(curShowGameObject.getUniqID());
            gameObjectShow = new ShowGameObject(id, choseObj.getAsset(), coord);
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
        imageNode.src = object.getAsset().getSpritePath();
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
        const x = helper.roundToPrevMult(Math.round(coords.x / zoom - camera.x), _G.blockSize);
        const y = helper.roundToPrevMult(Math.round(coords.y / zoom - camera.y), _G.blockSize);
        return this.curDisplayed.find((el) => x === el.coord.x && y === el.coord.y);
    }

    getCurDisplayed() {
        return this.curDisplayed;
    }
}
