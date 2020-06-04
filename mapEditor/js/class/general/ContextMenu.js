import * as plshelp from "../../lib/helpers.js";
import { DomBuilder } from "../../lib/DomBuilder.js";
import { Emitter } from "/mapEditor/js/lib/Emitter.js";
const dob = new DomBuilder();

export class ContextMenu {
    constructor() {
        this.emitter = new Emitter();

        this.types = {
            paletteContextMenu: {
                menu_el: {
                    tag: "div",
                    class: "palette-context-menu context-menu",
                    id: "palette_context_menu",
                    elements: {
                        list_el: {
                            tag: "ul",
                            class: "palette-context-menu-ul context-menu-ul",
                            elements: {
                                option_1_el: {
                                    name: "game_object_init",
                                    tag: "li",
                                    class: "palette-context-menu-li context-menu-li",
                                    callback: "createGameObject",
                                    inner: "Create game object",
                                },
                            },
                        },
                    },
                },
            },
            gameObjectContextMenu: {
                menu_el: {
                    tag: "div",
                    class: "gameObject-context-menu context-menu",
                    id: "gameObject_context_menu",
                    elements: {
                        list_el: {
                            tag: "ul",
                            class: "gameObject-context-menu-ul context-menu-ul",
                            elements: {
                                option_1_el: {
                                    name: "game_object_remove",
                                    tag: "li",
                                    class: "gameObject-context-menu-li context-menu-li",
                                    callback: "removeGameObject",
                                    inner: "Remove game object",
                                },
                            },
                        },
                    },
                },
            },
        };

        this.contextMenuStates = {
            paletteContextMenu: false,
            gameObjectContextMenu: false,
        };
    }

    createContextNode(nodeVar, load) {
        const menuJSON = this.types[nodeVar].menu_el;
        const listJSON = menuJSON.elements.list_el;
        const optionsJSON = listJSON.elements;

        const options = [];

        Object.keys(optionsJSON).forEach((key) => {
            const listener = {
                type: "click",
                callback: this[optionsJSON[key].callback].bind(this),
                args: [load],
                event: false,
            };
            const optionNode = dob.createNode(
                optionsJSON[key].tag,
                optionsJSON[key].class,
                null,
                optionsJSON[key].inner,
                listener
            ).done();
            options.push(optionNode);
        });

        const list = dob.createNode(listJSON.tag, listJSON.class, null, options).done();
        const menu = dob.createNode(menuJSON.tag, menuJSON.class, menuJSON.id, list).done();

        return menu;
    }

    toggle(nodeVar, coord, obj) {
        if (this.contextMenuStates[nodeVar]) {
            // [nodevar] context menu is already showing, remove it
            const htmlNode = document.getElementById(this.types[nodeVar].menu_el.id);
            htmlNode.remove();
            this.contextMenuStates[nodeVar] = false;
        }

        const htmlNode = this.createContextNode(nodeVar, obj);

        htmlNode.style.position = "absolute";
        htmlNode.style.left = `${coord.x}px`;
        htmlNode.style.top = `${coord.y}px`;

        document.body.appendChild(htmlNode);
        this.contextMenuStates[nodeVar] = htmlNode.id;
    }

    toggleAllOff() {
        Object.keys(this.contextMenuStates).forEach((key) => {
            if (this.contextMenuStates[key]) {
                const el = document.getElementById(this.contextMenuStates[key]);
                el.remove();
                this.contextMenuStates[key] = false;
            }
        });
    }

    createGameObject(asset) {
        this.emitter.emit("new_game_object", asset);
    }

    removeGameObject(object) {
        this.emitter.emit("remove_game_object", object);
    }
}
