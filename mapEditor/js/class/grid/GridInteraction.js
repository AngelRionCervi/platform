import { Emitter } from "/mapEditor/js/lib/Emitter.js";
import { Mouse } from "/mapEditor/js/class/mouseHandling/Mouse.js";
import { getGridDiv } from "../general/canvasRef.js";
const grid = getGridDiv();
const mouse = new Mouse();

export class GridInteraction {
    constructor() {
        this.isDrawing = false;
        this.isErasing = false;
        this.emitter = new Emitter();

        this.buttons = [
            { name: "addColRight", el: document.getElementById("add_col_right_btn"), ev: "add_col", args: ["right"] },
            { name: "addColLeft", el: document.getElementById("add_col_left_btn"), ev: "add_col", args: ["left"] },
            { name: "addRowTop", el: document.getElementById("add_row_top_btn"), ev: "add_row", args: ["top"] },
            {
                name: "addRowBottom",
                el: document.getElementById("add_row_bottom_btn"),
                ev: "add_row",
                args: ["bottom"],
            },
            {
                name: "removeColRight",
                el: document.getElementById("remove_col_right_btn"),
                ev: "remove_col",
                args: ["right"],
            },
            {
                name: "removeColLeft",
                el: document.getElementById("remove_col_left_btn"),
                ev: "remove_col",
                args: ["left"],
            },
            {
                name: "removeRowTop",
                el: document.getElementById("remove_row_top_btn"),
                ev: "remove_row",
                args: ["top"],
            },
            {
                name: "removeRowBottom",
                el: document.getElementById("remove_row_bottom_btn"),
                ev: "remove_row",
                args: ["bottom"],
            },
            { name: "dlButton", el: document.getElementById("dl_map_btn"), ev: "dl_map" },
        ];

        this.gridListeners();
        this.buttonListeners();
    }

    buttonListeners() {
        this.buttons.forEach((btn) => {
            btn.el.addEventListener("click", (evt) => {
                evt.preventDefault();
                let args;
                if (btn.args !== undefined) args = btn.args;
                this.emitter.emit(btn.ev, ...args);
            });
        });
    }

    gridListeners() {
        grid.addEventListener("mousedown", (evt) => {
            evt.preventDefault();
            const cursorPos = mouse.getCursorPos(evt);

            switch (evt.button) {
                case 0:
                    this.drawing = true;
                    this.erasing = false;
                    this.emitter.emit("grid_left_click", cursorPos);
                    break;
                case 2:
                    this.drawing = false;
                    this.erasing = true;
                    this.emitter.emit("grid_right_click", cursorPos);
                    break;
            }
        });

        grid.addEventListener("mouseup", (evt) => {
            evt.preventDefault();

            switch (evt.button) {
                case 0:
                    this.drawing = false;
                    break;
                case 2:
                    this.erasing = false;
                    break;
            }
        });

        grid.addEventListener("mousemove", (evt) => {
            let cursorPos = mouse.getCursorPos(evt);

            if (this.drawing) {
                this.emitter.emit("grid_left_move", cursorPos);
            } else if (this.erasing) {
                this.emitter.emit("grid_right_move", cursorPos);
            }
        });

        grid.addEventListener("wheel", (evt) => {
            evt.preventDefault();
            const dir = Math.sign(evt.deltaY);
            const curPos = mouse.getCursorPos(evt);
            this.emitter.emit("grid_wheel", { dir, curPos });
        });

        grid.addEventListener("contextmenu", (evt) => {
            evt.preventDefault();
            return false;
        });
    }
}
