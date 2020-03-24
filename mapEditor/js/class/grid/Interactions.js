import { Emitter } from "/js/lib/Emitter.js";
import { Mouse } from "/js/class/mouseHandling/Mouse.js";
const canvas = document.getElementById('mapEditorCanvas');
const mouse = new Mouse(canvas);

export class Interactions {
    constructor() {
        this.isDrawing = false;
        this.isErasing = false;
        this.emitter = new Emitter();

        this.elButtons = {
            addCol: document.getElementById('add_col'),
            addCol: document.getElementById('add_row'),
            addCol: document.getElementById('remove_col'),
            addCol: document.getElementById('remove_row'),
            dlMap: document.getElementById('dlMapBtn')
        }

        this.canvasListen();
    }

    canvasListen() {
        canvas.addEventListener('mousedown', (evt) => {
            evt.preventDefault();
            let cursorPos = mouse.getCursorPos(evt);
            
            switch(evt.button) {
                case 0:
                    this.drawing = true;
                    this.erasing = false;
                    this.emitter.emit('add_cell_by_cursor', cursorPos);
                    break;
                case 2:
                    this.drawing = false;
                    this.erasing = true;
                    this.emitter.emit('remove_cell_by_cursor', cursorPos);
                    break;
            }
        });
        
        canvas.addEventListener('mouseup', (evt) => {
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
        
        canvas.addEventListener('mousemove', (evt) => {
            let cursorPos;
            if (this.drawing || this.erasing) cursorPos = mouse.getCursorPos(evt);

            if (this.drawing) {
                this.emitter.emit('add_cell_by_cursor', cursorPos);
            } 
            else if (this.erasing) {
                this.emitter.emit('remove_cell_by_cursor', cursorPos);
            }
        })
        
        canvas.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            return false;
        });
    }
}