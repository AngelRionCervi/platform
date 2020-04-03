import * as plshelp from '../../lib/helpers.js';
import { DomBuilder } from '../../lib/DomBuilder.js';
const dob = new DomBuilder();

export class Palette {
    constructor(interaction) {
        this.interaction = interaction;
        this.currentDir = '/';
        this.directories = [];
        this.authorizedExensions = ['png', 'jpg'];
        this.assets;
        this.paletteContainer = document.getElementById('palette_container');

        this.dirInfo = {
            prevDir: null,
            absCurPath: null,
            curDir: null,
            fullPath: null,
            curDepth: null
        };
    }


    async loadAssets(filesObj) {

        const files = new FormData();

        filesObj.detail.forEach((fobj) => {

            if (!this.authorizedExensions.includes(fobj.name)) {
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


    setDirInfo(rootDir, fullPath, back) {
        if (!this.dirInfo.absCurPath) {
            fullPath += '/';
            this.dirInfo.absCurPath = fullPath.slice(0, fullPath.indexOf(rootDir));
        }

        this.dirInfo.prevDir = this.dirInfo.absCurPath.slice(0, -1).split('/').pop() + '/';

        if (back) {
            const indexAbsDir = this.dirInfo.absCurPath.indexOf(rootDir);
            const indexDir = rootDir.indexOf('/');
            this.dirInfo.absCurPath = this.dirInfo.absCurPath.slice(0, indexAbsDir + indexDir) + '/';
        } else {
            this.dirInfo.absCurPath += rootDir;
        }

        if (this.dirInfo.absCurPath.indexOf('assets/') >= this.dirInfo.absCurPath.indexOf(this.dirInfo.prevDir)) {
            this.dirInfo.prevDir = 'assets/';
        }

        this.dirInfo.curDir = rootDir;
        this.dirInfo.fullPath = fullPath;
    }


    buildFrom(assets, rootDir, fullPath, back = null) {

        this.assets = assets;

        this.setDirInfo(rootDir, fullPath, back);
        this.removePaletteEls();

        const directoriesList = [];

        assets.forEach((asset) => {
           
            const relPath = asset.path.slice(asset.path.indexOf(rootDir), asset.path.length).split('/').removeAt(0, 1).join('/');

            if (relPath.includes('/')) {
                const dirName = relPath.split('/').shift();

                if (!directoriesList.includes(dirName)) {
                    directoriesList.push(dirName);
                    const directoryEl = this.getDirectoryEl(dirName, assets, fullPath);
                    this.paletteContainer.insertBefore(directoryEl, this.paletteContainer.firstChild);
                }
            }
            else if (this.authorizedExensions.includes(relPath.split('.').pop())) {
                const paletteCellEl = this.getPaletteCellEl(asset);
                this.paletteContainer.appendChild(paletteCellEl);
            }
        })

    }


    removePaletteEls() {
        while (this.paletteContainer.firstElementChild) {
            this.paletteContainer.firstElementChild.remove();
        }
    }


    getDirectoryEl(dirName, assets, fullPath) {
        const nameNode = dob.createNode('div', 'directory-name', null, '/' + dirName);
        const imageNode = dob.createNode('img', 'directory-img');
        imageNode.src = './images/palette/directory.png';
        const listener = { type: 'click', callback: this.buildFrom.bind(this), args: [assets, dirName + '/', fullPath], event: false };
        const el = dob.createNode('div', 'palette-folder', null, [imageNode, nameNode], listener);

        return el;
    }


    getPaletteCellEl(asset) {
        const imageNode = dob.createNode('img', 'palette-img');
        imageNode.src = asset.path;
        const listener = { type: 'click', callback: this.interaction.handlePaletteClick, args: [this.interaction, asset] };
        const paletteCellEl = dob.createNode('div', 'palette-cell', null, imageNode, listener);

        return paletteCellEl;
    }


    getDirInfo() {
        return this.dirInfo;
    }


    getAssets() {
        return this.assets;
    }

}