import { Emitter } from "/mapEditor/js/lib/Emitter.js";
import { Mouse } from "/mapEditor/js/class/mouseHandling/Mouse.js";
const grid = document.getElementById('canvas_grid');
const mouse = new Mouse(grid);

export class GridInteraction {
    constructor() {
        this.isDrawing = false;
        this.isErasing = false;
        this.emitter = new Emitter();

        this.elButtons = [
            { name: 'addCol', el: document.getElementById('add_col_btn'), ev: "add_col" },
            { name: 'addRow', el: document.getElementById('add_row_btn'), ev: "add_row" },
            { name: 'removeCol', el: document.getElementById('remove_col_btn'), ev: "remove_col" },
            { name: 'removeRow', el: document.getElementById('remove_row_btn'), ev: "remove_row" },
            { name: 'dlButton', el: document.getElementById('dl_map_btn'), ev: "dl_map" },
        ]

        this.gridListeners();
        this.buttonListeners();
    }

    buttonListeners() {

        this.elButtons.forEach((btn) => {
            btn.el.addEventListener('click', (evt) => {
                evt.preventDefault();
                const cursorPos = mouse.getCursorPos(evt);
                this.emitter.emit(btn.ev, cursorPos);
            })
        })
    }

    gridListeners() {

        grid.addEventListener('mousedown', (evt) => {
            evt.preventDefault();
            const cursorPos = mouse.getCursorPos(evt);
            console.log(cursorPos)
            
            switch(evt.button) {
                case 0:
                    this.drawing = true;
                    this.erasing = false;
                    this.emitter.emit('grid_left_click', cursorPos);
                    break;
                case 2:
                    this.drawing = false;
                    this.erasing = true;
                    this.emitter.emit('grid_right_click', cursorPos);
                    break;
            }
        });
        
        grid.addEventListener('mouseup', (evt) => {
            evt.preventDefault();
            
            switch(evt.button) {
                case 0:
                    this.drawing = false;
                    break;
                case 2:
                    this.erasing = false;
                    break;
            }
        });
        
        grid.addEventListener('mousemove', (evt) => {
            let cursorPos;
            if (this.drawing || this.erasing) cursorPos = mouse.getCursorPos(evt);

            if (this.drawing) {
                this.emitter.emit('grid_left_move', cursorPos);
            } 
            else if (this.erasing) {
                this.emitter.emit('grid_right_move', cursorPos);
            }
        })
        
        grid.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            return false;
        });
    }
}