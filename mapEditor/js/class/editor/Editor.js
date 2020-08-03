import gridProps from "./grid/GridProps.js";
import { Emitter } from "../../lib/Emitter.js";
import { DomBuilder } from "../../lib/DomBuilder.js";
import layout from "./EditorLayout.js";
const dob = new DomBuilder();

class Editor {
    constructor() {
        this.emitter = new Emitter();
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
        this.state = {
            gridWidth: gridProps.getAbsWidth(),
            gridHeight: gridProps.getAbsHeight(),
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
        const gridWidthField = dob
            .createNode("input", "params-input")
            .addCustomAttr2({ type: "text" })
            .onChange((evt) => this.setGridWidth(evt))
            .done();

        const setSizeBtn = dob
            .createNode("button", "params-button", null, "ok")
            .onClick(() => this.callResize())
            .done();

        const gridHeightField = dob
            .createNode("input", "params-input")
            .addCustomAttr2({ type: "text" })
            .onChange((evt) => this.setGridHeight(evt))
            .done();

        const widthLabel = dob.createNode("p", "params-label", null, "width : ").done();
        const heightLabel = dob.createNode("p", "params-label", null, "height : ").done();

        const gridWidthEl = dob.enclose([widthLabel, gridWidthField], "params-label-input").done();
        const gridHeightEl = dob.enclose([heightLabel, gridHeightField], "params-label-input").done();

        const paramsContainer = dob
            .createNode("div", "params-container", "params_container", [
                dob.enclose([gridWidthEl, gridHeightEl]).done(),
                setSizeBtn,
            ])
            .done();

        return paramsContainer;
    }

    setGridWidth(evt) {
        const newWidth = parseInt(evt.target.value);
        if (isNaN(newWidth) || this.state.gridWidth === newWidth) return;
        this.state.gridWidth = newWidth;
    }

    setGridHeight(evt) {
        const newHeight = parseInt(evt.target.value);
        if (isNaN(newHeight) || this.state.gridHeight === newHeight) return;
        this.state.gridHeight = newHeight;
    }

    callResize() {
        if (gridProps.getAbsWidth() === this.state.gridWidth && gridProps.getAbsHeight() === this.state.gridHeight) {
            return;
        }
        this.emitter.emit("gridResize", { width: this.state.gridWidth, height: this.state.gridHeight });
    }
}

export default new Editor();
