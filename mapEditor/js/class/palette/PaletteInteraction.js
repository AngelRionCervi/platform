import { getDroppedOrSelectedFiles } from '/mapEditor/js/lib/fileDrop.js';
import { Emitter } from "/mapEditor/js/lib/Emitter.js";

export class PaletteInteraction {
    constructor() {
        this.emitter = new Emitter();
        this.dropZone = document.getElementById('palette_drop');
        this.directoryBackButton = document.getElementById('directory_back_button');
        this.currentPaletteCell = { id: '' };
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

    handlePaletteClick(e, _this, asset) {
        console.log("palette click", asset.id, _this.currentPaletteCell.id)
        if (asset.id !== _this.currentPaletteCell.id) {
             _this.currentPaletteCell = asset;
             _this.emitter.emit('palette_asset_change', asset);
        }
    }

    handleDirectoryClick(e, _this, directory) {
        console.log('click on directory ', directory)
    }

    getCurrentPaletteCell() {
        return this.currentPaletteCell;
    }

}