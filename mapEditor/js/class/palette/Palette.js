import * as plshelp from '../../lib/helpers.js';
import { DomBuilder } from '../../lib/DomBuilder.js';
const dob = new DomBuilder();

export class Palette {
    constructor(interaction) {
        this.interaction = interaction;
        this.currentDir = '/';
        this.directories = [];
        this.dirDepth = 0;
        this.authorizedExensions = ['png', 'jpg'];
    }


    async loadAssets(filesObj) {

        const files = new FormData();

        filesObj.detail.forEach((fobj) => {

            if (!fobj.name.includes('.jpg') && !fobj.name.includes('.png')) {
                throw new Error('files must be either .png or .jpg');
            }

            const filteredObj = plshelp.propsRemover(fobj, 'fileObject');

            files.append('filesRaw', fobj.fileObject);
            files.append('infos', JSON.stringify(filteredObj));
        })

        const postObj = { method: "POST", body: files };
        const response = await fetch('http://localhost:5000/assetsUpload', postObj);
        return await response.json();
    }


    buildFrom(assets, rootDir, fullPath, _this = null) {

        if (!_this) _this = this;

        const paletteContainer = document.getElementById('palette_container');

        while (paletteContainer.firstElementChild) {
            paletteContainer.firstElementChild.remove();
        }

        assets.forEach((asset) => {
     
            const relPath = asset.path.slice(asset.path.indexOf(rootDir), asset.path.length).split('/').removeAt(0, 1).join('/');
            console.log(fullPath + '/' + rootDir + '/' + relPath);
            
            if (relPath.includes('/')) {
                const dirName = relPath.split('/').shift();

                if (!_this.directories.includes(dirName)) {
                    _this.directories.push(dirName);
                    const listener = { type: 'click', callback: _this.buildFrom, args: [assets, dirName + '/', fullPath, _this], event: false };
                    const folder = dob.createNode('div', 'palette-folder', null, null, listener);
                    paletteContainer.appendChild(folder);
                }
            }
            else if (_this.authorizedExensions.includes(relPath.split('.').pop())) {
                const imageNode = dob.createNode('img', 'palette-img');
                imageNode.src = asset.path;
                const listener = { type: 'click', callback: _this.interaction.handlePaletteClick, args: [_this.interaction, asset] };
                const paletteCell = dob.createNode('div', 'palette-cell', null, imageNode, listener);
                paletteContainer.appendChild(paletteCell);
            }
        })
    }

}