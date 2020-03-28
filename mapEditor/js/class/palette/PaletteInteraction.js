import { getDroppedOrSelectedFiles } from '/mapEditor/js/lib/fileDrop.js';
import { Emitter } from "/mapEditor/js/lib/Emitter.js";

export class PaletteInteraction {
    constructor() {
        this.emitter = new Emitter();
        this.dropZone = document.getElementById('palette_drop');
    }

    watchDrop() {

        this.dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
        })
        this.dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            getDroppedOrSelectedFiles(e).then((files) => {
                this.emitter.emit('palette_assets_received', files);
            })
        })
    }

    handlePaletteClick(e) {
        console.log(e)
    }
}