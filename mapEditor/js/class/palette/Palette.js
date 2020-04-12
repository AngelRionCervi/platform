import * as plshelp from "../../lib/helpers.js";
import { DomBuilder } from "../../lib/DomBuilder.js";
const dob = new DomBuilder();

export class Palette {
    constructor(interaction) {
        this.interaction = interaction;
        this.currentDir = "/";
        this.directories = [];
        this.authorizedExensions = ["png", "jpg"];
        this.assets;
        this.paletteContainer = document.getElementById("palette_container");
        this.currentAssetID = null;

        this.dirInfo = {
            rootDir: null,
            prevDir: null,
            absCurPath: null,
            curDir: null,
            fullPath: null,
            curDepth: null,
        };
    }

    async loadAssets(filesObj) {
        const files = new FormData();

        filesObj.detail.forEach((fobj) => {
            if (!this.authorizedExensions.includes(fobj.name.split(".").pop())) {
                throw new Error("files must be either .png or .jpg");
            }

            const filteredObj = plshelp.propsRemover(fobj, "fileObject");

            files.append("filesRaw", fobj.fileObject);
            files.append("infos", JSON.stringify(filteredObj));
        });

        const postObj = { method: "POST", body: files };
        const response = await fetch("http://localhost:5000/assetsUpload", postObj);
        return await response.json();
    }

    setDirInfo(rootDir, fullPath, back = null) {
        if (!this.dirInfo.absCurPath) {
            fullPath += "/";
            this.dirInfo.absCurPath = fullPath.slice(0, fullPath.indexOf(rootDir));
        }

        if (back) {
            const splittedPath = this.dirInfo.absCurPath.split("/");
            const indexAbsDir = splittedPath
                .removeAt(splittedPath.length - 1, splittedPath.length)
                .join("/")
                .lastIndexOf(rootDir);
            const indexDir = rootDir.indexOf("/");
            this.dirInfo.absCurPath = this.dirInfo.absCurPath.slice(0, indexAbsDir + indexDir) + "/";

            this.dirInfo.prevDir = splittedPath[splittedPath.length - 3] + "/";
            this.dirInfo.prevDirIndex = this.dirInfo.absCurPath.indexOf(this.dirInfo.prevDir);
        } else {
            this.dirInfo.prevDir = this.dirInfo.absCurPath.slice(0, -1).split("/").pop() + "/";
            this.dirInfo.prevDirIndex = this.dirInfo.absCurPath.indexOf(this.dirInfo.prevDir);

            this.dirInfo.absCurPath += rootDir;
        }

        this.dirInfo.curDir = rootDir;
        this.dirInfo.curDirIndex = this.dirInfo.absCurPath.lastIndexOf(rootDir);
        this.dirInfo.fullPath = fullPath;
    }

    buildFrom(assets, rootDir, fullPath, back = null) {
        this.assets = assets;

        this.setDirInfo(rootDir, fullPath, back);
        this.removePaletteEls();

        const directoriesList = [];

        assets.forEach((asset) => {
            const currentPath = asset.path.slice(this.dirInfo.curDirIndex - 1);
            const relPath = currentPath
                .slice(currentPath.indexOf(rootDir), currentPath.length)
                .split("/")
                .removeAt(0, 1)
                .join("/");

            if (relPath.includes("/")) {
                const dirName = relPath.split("/").shift();
                if (!directoriesList.includes(dirName)) {
                    directoriesList.push(dirName);
                    const directoryEl = this.getDirectoryEl(dirName, assets, fullPath);
                    this.paletteContainer.insertBefore(directoryEl, this.paletteContainer.firstChild);
                }
            } else if (this.authorizedExensions.includes(relPath.split(".").pop())) {
                const paletteCellEl = this.getPaletteCellEl(asset);
                this.paletteContainer.appendChild(paletteCellEl);
            }
        });
    }

    removePaletteEls() {
        while (this.paletteContainer.firstElementChild) {
            this.paletteContainer.firstElementChild.remove();
        }
    }

    getDirectoryEl(dirName, assets, fullPath) {
        const nameNode = dob.createNode("div", "directory-name", null, "/" + dirName);
        const imageNode = dob.createNode("img", "directory-img");
        imageNode.src = "./images/palette/directory.png";
        const listener = {
            type: "click",
            callback: this.buildFrom.bind(this),
            args: [assets, dirName + "/", fullPath],
            event: false,
        };
        const el = dob.createNode("div", "palette-folder", null, [imageNode, nameNode], listener);

        return el;
    }

    getPaletteCellEl(asset) {
        let name;
        if (asset.name.length > 20) {
            name = asset.name.slice(0, 20) + "...";
        } else {
            name = asset.name;
        }
        const nameNode = dob.createNode("div", "directory-name", null, name);
        const imageNode = dob.createNode("img", "palette-img");
        imageNode.src = asset.path;
        const leftListener = {
            type: "click",
            callback: this.interaction.handlePaletteClick.bind(this.interaction),
            args: [asset],
        };
        const contextListener = {
            type: "contextmenu",
            callback: this.interaction.handlePaletteContextClick.bind(this.interaction),
            args: [asset],
        };
        const paletteCellEl = dob.createNode(
            "div",
            "palette-cell",
            null,
            [imageNode, nameNode],
            [leftListener, contextListener]
        );

        return paletteCellEl;
    }

    styleSelectedCell(target) {
        while (!target.classList.contains("palette-cell")) {
            target = target.parentElement;
        }
        this.removeSelectedStyle();
        target.classList.add("palette-cell-target");
    }

    selectAsset(asset) {
        if (asset.id !== this.currentAssetID) {
            this.currentAssetID = asset.id;
        }
    }

    resetSelection() {
        this.currentAssetID = null;
        this.removeSelectedStyle();
    }

    removeSelectedStyle() {
        Array.from(document.getElementsByClassName("palette-cell-target")).forEach((cell) => {
            cell.classList.remove("palette-cell-target");
        });
    }

    isAnAssetSelected() {
        return this.currentAssetID ? true : false;
    }

    getCurrentAssetID() {
        return this.currentAssetID;
    }

    getDirInfo() {
        return this.dirInfo;
    }

    getAssets() {
        return this.assets;
    }
}
