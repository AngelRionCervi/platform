import { DomBuilder } from "../../lib/DomBuilder.js";
const dob = new DomBuilder();

class Editor {
    constructor() {
        const editorCanvas = dob
            .createNode("canvas", null, "mapEditorCanvas")
            .addInlineStyle({ backgroundColor: "white" })
            .done();
        const canvasGrid = dob.createNode("div", "canvas-grid", "canvas_grid").done();
        justAnotherWin.add(
            { x: 100, y: 0, width: window.innerWidth - 200, height: window.innerHeight - 300, name: "editorWindow" },
            dob.enclose([editorCanvas, canvasGrid]).addInlineStyle({ position: "relative" }).done()
        );
    }
}

export default new Editor();
