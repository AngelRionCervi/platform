import { getDroppedOrSelectedFiles } from '/mapEditor/js/lib/fileDrop.js';
import { Emitter } from "/mapEditor/js/lib/Emitter.js";

export class PaletteInteraction {
    constructor() {
        this.emitter = new Emitter();
        this.dropZone = document.getElementById('palette_drop');
        this.directoryBackButton = document.getElementById('directory_back_button');
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

    watchDirectoryBack() {
        this.directoryBackButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.emitter.emit('palette_directory_back');
        })
    }

    handlePaletteClick(e, asset) {
        this.emitter.emit('palette_asset_change', { target: e.target, asset: asset });
    }

    handlePaletteContextClick(e, asset) {
        e.preventDefault();
        const coord = {
            x: e.pageX,
            y: e.pageY
        };
        this.emitter.emit('palette_context_toggle', { coord, asset });
    }

    handleDirectoryClick(e, directory) {
        console.log('click on directory ', directory)
    }

}