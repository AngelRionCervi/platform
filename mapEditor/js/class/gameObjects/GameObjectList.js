import { GameObject } from "/mapEditor/js/class/gameObjects/GameObject.js";
import { DomBuilder } from "../../lib/DomBuilder.js";
import * as helper from "../../lib/helpers.js";
const dob = new DomBuilder();

export class GameObjectList {
    constructor(interaction) {
        this.interaction = interaction;
        this.domEl = document.getElementById("game_objects_container");
        this.prevObjectsIDs = [];
        this.objects = [];
        this.curSelected = null;
    }

    addObject({ path, name, id }) {
        const object = new GameObject(path, name, id);

        this.objects.push(object);
        this.updateDomList();
    }

    removeObject(id) {
        const curIds = this.objects.map((el) => el.getID());
        this.objects.splice(curIds.indexOf(id), 1);
        this.updateDomList();
    }

    updateDomList() {
        const currentIDs = this.objects.map((el) => el.id);
        const prevIDs = this.prevObjectsIDs;

        const toAdd = currentIDs.filter((el) => !prevIDs.includes(el));
        const toRemove = prevIDs.filter((el) => !currentIDs.includes(el));

        toAdd.forEach((id) => {
            this.buildDomNode(this.getObjectById(id));
        });
        toRemove.forEach((id) => {
            this.removeDomNode(id);
        });

        this.prevObjectsIDs = this.objects.map((el) => el.id);
    }

    buildDomNode(object) {
        let name = object.getFileName();
        if (name.length > 20) {
            name = name.slice(0, 20) + "...";
        }
        const nameNode = dob.createNode("div", "game-object-name", null, name);
        const imageNode = dob.createNode("img", "game-object-img");
        imageNode.src = object.getSpritePath();
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
        const objectEl = dob.createNode(
            "div",
            "game-object-cell",
            "go_" + object.getID(),
            [imageNode, nameNode],
            [leftListener, contextListener]
        );
        this.domEl.appendChild(objectEl);
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

    getObjectById(id) {
        return this.objects.find((el) => el.id === id);
    }
}
