import * as _ from '../../lib/helpers.js';
import { DomBuilder } from '../../lib/DomBuilder.js';
import { PaletteInteraction } from './PaletteInteraction.js'
const dob = new DomBuilder();

export class Palette {
    constructor(interaction) {
        this.interaction = interaction;
    }


    async loadAssets(filesObj) {

        const files = new FormData();

        filesObj.detail.forEach((fobj) => {
            console.log(fobj)
            if (!fobj.name.includes('.jpg') && !fobj.name.includes('.png')) {
                throw new Error('files must be either .png or .jpg');
            }

            const filteredObj = Object.keys(fobj)
                .filter(key => key !== 'fileObject')
                .reduce((obj, key) => {
                    obj[key] = fobj[key];
                    return obj;
                }, {});

            files.append('filesRaw', fobj.fileObject);
            files.append('infos', JSON.stringify(filteredObj));
        })

        const postObj = { method: "POST", body: files };
        const response = await fetch('http://localhost:5000/assetsUpload', postObj);
        return await response.json();
    }


    build(assets) {
        const paletteContainer = document.getElementById('palette_container');
        document.getElementById('palette_drop').style.display = "none";

        assets.res.forEach((asset) => {
            const imageNode = dob.createNode('img', 'palette-img');
            imageNode.src = asset.path;
            const listener = { type: 'click', callback: this.interaction.handlePaletteClick, args: [] }
            const paletteCell = dob.createNode('div', 'palette-cell', null, imageNode, listener);
            paletteContainer.appendChild(paletteCell)
        })
    }

}