import * as plshelp from "../../lib/helpers.js";
import { DomBuilder } from "../../lib/DomBuilder.js";
import { Emitter } from "/mapEditor/js/lib/Emitter.js";
const dob = new DomBuilder();

export class ContextMenu {
    constructor() {
        this.emitter = new Emitter();

        this.types = {
            palette: {
                menu_el: {
                    tag: "div",
                    class: "palette-context-menu",
                    id: "palette_context_menu",
                    elements: {
                        list_el: {
                            tag: "ul",
                            class: "palette-context-menu-ul",
                            elements: {
                                option_1_el: {
                                    name: "game_object_init",
                                    tag: "li",
                                    class: "palette-context-menu-li",
                                    callback: "createGameObject",
                                    inner: "Create game object",
                                },
                            },
                        },
                    },
                },
            },
        };

        this.contextMenuStates = {
            paletteContextMenu: false,
        };
    }

    paletteContextMenuCreate(asset) {
        const menuJSON = this.types.palette.menu_el;
        const listJSON = menuJSON.elements.list_el;
        const optionsJSON = listJSON.elements;

        const options = [];

        Object.keys(optionsJSON).forEach((key) => {
            const listener = { type: "click", callback: this[optionsJSON[key].callback].bind(this), args: [asset], event: false };
            const optionNode = dob.createNode(optionsJSON[key].tag, optionsJSON[key].class, null, optionsJSON[key].inner, listener);
            options.push(optionNode);
        });

        const list = dob.createNode(listJSON.tag, listJSON.class, null, options);
        const menu = dob.createNode(menuJSON.tag, menuJSON.class, menuJSON.id, list);

        return menu;
    }

    toggle(nodeVar, coord, asset) {
        if (this.contextMenuStates[nodeVar]) {
            const htmlNode = document.getElementById(this.types.palette.menu_el.id);
            htmlNode.remove();
            this.contextMenuStates[nodeVar] = false;
        }

        const htmlNode = this[`${nodeVar}Create`](asset);

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
}
