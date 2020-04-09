import { GameObject } from "/mapEditor/js/class/gameObjects/GameObject.js";
import { DomBuilder } from "../../lib/DomBuilder.js";
import * as helper from "../../lib/helpers.js";
const dob = new DomBuilder();

export class GameObjectList {
    constructor() {
        this.domEl = document.getElementById('game_objects_container');
        this.prevObjectsIDs = [];
        this.objects = [];
    }

    addObject({ path, name, id }) {
        const object = new GameObject(path, name, id);

        this.objects.push(object);
        this.updateDomList();
    }

    updateDomList() {
        const currentIDs = this.objects.map(el => el.id);
        const prevIDs = this.prevObjectsIDs;

        const toAdd = currentIDs.filter(el => !prevIDs.includes(el));
        const toRemove = prevIDs.filter(el => !currentIDs.includes(el));
        //console.log('current', this.objects, "toadd", toAdd, "toremove", toRemove)
        toAdd.forEach((id) => {
            this.buildDomNode(this.getObjectById(id));
        })
        toRemove.forEach((id) => {
            this.removeDomNode(this.getObjectById(id));
        })

        this.prevObjectsIDs = this.objects.map(el => el.id);
    }

    buildDomNode(object) {
        let name = object.getFileName();
        if (name.length > 20) {
            name = name.slice(0, 20) + '...';
        }
        const nameNode = dob.createNode('div', 'game-object-name', null, name);
        const imageNode = dob.createNode('img', 'game-object-img');
        imageNode.src = object.getSpritePath();
        /*const leftListener = { type: 'click', callback: this.interaction.handlePaletteClick.bind(this.interaction), args: [asset] };
        const contextListener = { type: 'contextmenu', callback: this.interaction.handlePaletteContextClick.bind(this.interaction), args: [asset] };*/
        const paletteCellEl = dob.createNode('div', 'game-object-cell', null, [imageNode, nameNode]);
        this.domEl.appendChild(paletteCellEl);
    }


    getObjectById(id) {
        return this.objects.find(el => el.id === id);
    }
}
