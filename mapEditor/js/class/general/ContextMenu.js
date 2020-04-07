import * as plshelp from '../../lib/helpers.js';
import { DomBuilder } from '../../lib/DomBuilder.js';
const dob = new DomBuilder();

export class ContextMenu {
    constructor() {
        this.types = {
            palette: {
                menu_el: {
                    tag: 'div',
                    class: 'palette-context-menu',
                    id: 'palette_context_menu',
                    elements: {
                        list_el: {
                            tag: 'ul',
                            class: 'palette-context-menu-ul',
                            elements: {
                                option_1_el: {
                                    tag: 'li',
                                    class: 'palette-context-menu-li',
                                    inner: 'Create game object',
                                },
                                option_2_el: {
                                    tag: 'li',
                                    class: 'palette-context-menu-li',
                                    inner: 'do smth 1',
                                },
                                option_3_el: {
                                    tag: 'li',
                                    class: 'palette-context-menu-li',
                                    inner: 'do smth 2',
                                },
                            }
                        }
                    }
                }
            }
        }



        this.contextMenuStates = {
            paletteContextMenu: false
        }
    }


    paletteContextMenuCreate(asset) {
        console.log(asset)
        const menuJSON = this.types.palette.menu_el;
        const listJSON = menuJSON.elements.list_el;
        const optionsJSON = listJSON.elements;

        const options = [];

        Object.keys(optionsJSON).forEach((key) => {
            const optionNode = dob.createNode(optionsJSON[key].tag, optionsJSON[key].class, null, optionsJSON[key].inner);
            options.push(optionNode);
        })

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

        htmlNode.style.position = 'absolute';
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
        })
    }

}