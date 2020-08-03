import { _G } from "../general/globals.js";
import { selectionContainer } from "../general/canvasRef.js";

class EntitySelection {
    constructor() {
        this.list = [];
        this.anInterval = null;
        this.anFrames = _G.selectionDashLength * 3;
        this.anIndex = 0;
    }

    getTextures(gameObjectInst) {
        const textures = [];
        const borderWidth = _G.selectionBorderWidth;
        const dashLen = _G.selectionDashLength;

        for (let u = 0; u < dashLen * 3; u++) {
            const buffer = document.createElement("canvas");
            buffer.width = gameObjectInst.defaultAsset.trueWidth + borderWidth * 2;
            buffer.height = gameObjectInst.defaultAsset.trueHeight + borderWidth * 2;
            const bufferCtx = buffer.getContext("2d");

            bufferCtx.strokeStyle = "white";
            bufferCtx.lineWidth = borderWidth;
            bufferCtx.setLineDash([dashLen, dashLen * 2]);
            bufferCtx.lineDashOffset = u;
            bufferCtx.strokeRect(0, 0, buffer.width, buffer.height);

            bufferCtx.strokeStyle = "black";
            bufferCtx.lineDashOffset = u + dashLen;
            bufferCtx.strokeRect(0, 0, buffer.width, buffer.height);
            document.body.appendChild(buffer);

            const texture = new PIXI.Texture.from(buffer);
            textures.push(texture);
        }

        return textures;
    }

    add(gameObjectInst) {
        const textures = this.getTextures(gameObjectInst);
        const selectionSprite = new PIXI.AnimatedSprite(textures);
        selectionSprite.animationSpeed = 0.4;
        selectionSprite.play();
        selectionContainer.addChild(selectionSprite);

        this.list.push({
            sprite: selectionSprite,
            instance: gameObjectInst,
            coord: gameObjectInst.coord,
            width: gameObjectInst.defaultAsset.trueWidth,
            height: gameObjectInst.defaultAsset.trueHeight,
            goInstID: gameObjectInst.id
        });
    }

    create() {
        this.render();
    }

    render() {
        const borderWidth = _G.selectionBorderWidth;

        this.list.forEach((info) => {
            info.sprite.position.set(
                info.coord.x - borderWidth,
                info.coord.y - borderWidth
            );
            info.instance.sprite.position.set(
                info.coord.x,
                info.coord.y
            );
        });
    }


    isSelected(id) {
        return this.list.some((el) => el.goInstID === id);
    }

    unselect(id) {
        const index = this.list.findIndex((el) => el.goInstID === id);
        if (index >= 0) {
            this.list.splice(index, 1);
            selectionContainer.removeChildAt(index);
        }
    }

    unselectAll() {
        this.list.splice(0, this.list.length);
        selectionContainer.removeChildren();
    }

    getList() {
        return this.list;
    }

    getSelectedIDs() {
        return this.list.map((el) => el.goInstID);
    }
}

export default new EntitySelection();
