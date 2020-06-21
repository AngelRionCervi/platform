import { DomBuilder } from "../../lib/DomBuilder.js";
import layout from "../editor/EditorLayout.js";
const dob = new DomBuilder();

class Tools {
    constructor() {
        this.container = dob.createNode("div", "tools-container", "tools_container").done();
        this.toolsWindow = justAnotherWin.add(
            { x: layout.tools.x, y: layout.tools.y, width: layout.tools.width, height: layout.tools.height },
            this.container
        );
        this.toolsModel = [
            { name: "brush", icon: "B", onSelect: () => this.toggleTool("brush") },
            { name: "bucket", icon: "Q", onSelect: () => this.toggleTool("bucket") },
        ];
        this.selected = null;
        this.toolCells = this.build();
        this.toggleTool("brush");
    }

    build() {
        const cells = [];
        this.toolsModel.forEach((tool) => {
            const listener = { type: "click", callback: tool.onSelect };
            const cell = dob
                .createNode("div", "tool-cell", null, tool.icon, listener)
                .addInlineStyle({ cursor: "pointer" })
                .done();
            cells.push({ name: tool.name, node: cell });
            document.getElementById("tools_container").appendChild(cell);
        });
        return cells;
    }

    toggleTool(name) {
        if (this.selected === name) return;
        this.getByName(name).node.classList.add("tool-selected");
        if (this.selected) {
            this.getAllButName(name)
                .find((el) => el.name === this.selected)
                .node.classList.remove("tool-selected");
        }
        this.selected = name;
    }

    getByName(name) {
        return this.toolCells.find((el) => el.name === name);
    }

    getAllButName(name) {
        return this.toolCells.filter((el) => el.name !== name);
    }

    getSelected() {
        return this.selected;
    }
}

export default new Tools();
