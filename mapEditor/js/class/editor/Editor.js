import gridProps from "./GridProps.js";
import { DomBuilder } from "../../lib/DomBuilder.js";
import layout from "./EditorLayout.js";
const dob = new DomBuilder();

class Editor {
    constructor() {
        this.canvas = this.buildCanvas();
        this.params = this.buildParams();
        justAnotherWin.add(
            {
                x: layout.editor.x,
                y: layout.editor.y,
                width: layout.editor.width,
                height: layout.editor.height,
                name: "editorWindow",
            },
            dob.enclose([this.canvas, this.params], "editor-container").done()
        );
        console.log(gridProps);
        this.state = {
            gridWidth: gridProps.getWidth(),
            gridHeight: gridProps.getHeight(),
        };
    }

    buildCanvas() {
        const editorCanvas = dob
            .createNode("canvas", null, "mapEditorCanvas")
            .addInlineStyle({ backgroundColor: "white" })
            .done();
        const canvasGrid = dob.createNode("div", "canvas-grid", "canvas_grid").done();
        return dob.enclose([editorCanvas, canvasGrid]).addInlineStyle({ position: "relative" }).done();
    }

    buildParams() {
        const listeners = {
            gridWidth: { type: "click", callback: () => this.changeGridWidth() },
            gridHeight: { type: "click", callback: () => this.changeGridHeight() },
        };

        const gridWidthField = dob
            .createNode("input", "params-input")
            .addCustomAttr2({ type: "text" })
            .onChange((evt) => this.setGridWidth(evt))
            .done();

        const gridWidthBtn = dob.createNode("button", "params-button", null, "ok", listeners.gridWidth).done();

        const paramsContainer = dob
            .createNode("div", "params-container", "params_container", [gridWidthField, gridWidthBtn])
            .addInlineStyle({ backgroundColor: "white" })
            .done();

        return paramsContainer;
    }

    setGridWidth(evt) {
        const newWidth = parseInt(evt.target.value);
        if (isNaN(newWidth) || this.state.gridWidth === newWidth) return;
        this.state.gridWidth = newWidth;
        console.log("set grid width", newWidth);
    }

    changeGridWidth() {
        if (gridProps.getWidth() === this.state.gridWidth) return;
        gridProps.setWidth(this.state.gridWidth * gridProps.getBlockSize());
        // change the size btn style with a loop
        console.log(gridProps.getWidth());
        console.log("change grid width", this.state.gridWidth);
    }
}

export default new Editor();
