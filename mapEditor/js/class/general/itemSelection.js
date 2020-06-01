import { _G } from "../general/globals.js";
import { gridProps } from "../grid/Grid.js";
import camera from "../Camera/Camera.js";
import { getCanvas, getContext } from "../general/canvasRef.js";

const canvas = getCanvas();
const ctx = getContext();

class ItemSelection {
    constructor() {
        this.list = [];
        this.anInterval = null;
        this.anFrames = _G.selectionDashLength * 3;
        this.anIndex = 0;
    }

    add(gameObjectInst) {
        this.list.push({
            coord: gameObjectInst.coord,
            width: gameObjectInst.bufferObj.buffer.width,
            height: gameObjectInst.bufferObj.buffer.height,
            rendered: false,
        });
    }

    create() {
        this.render();
    }

    render() {
        const camCoord = camera.getCoords();
        const ts = camera.toScreen.bind(camera);
        const borderWidth = _G.selectionBorderWidth;
        const dashLen = _G.selectionDashLength;

        this.list.forEach((info) => {
            const buffer = document.createElement("canvas");
            buffer.width = ts(info.width) + borderWidth * 2;
            buffer.height = ts(info.height) + borderWidth * 2;
            const bufferCtx = buffer.getContext("2d");

            bufferCtx.strokeStyle = "white";
            bufferCtx.lineWidth = borderWidth;
            bufferCtx.setLineDash([dashLen, dashLen*2]);
            bufferCtx.lineDashOffset = this.anIndex;
            bufferCtx.strokeRect(0, 0, buffer.width, buffer.height);

            bufferCtx.strokeStyle = "black";
            bufferCtx.lineDashOffset = this.anIndex + dashLen;
            bufferCtx.strokeRect(0, 0, buffer.width, buffer.height);

            ctx.drawImage(
                buffer,
                ts(camCoord.x + info.coord.x) - borderWidth,
                ts(camCoord.y + info.coord.y) - borderWidth
            );
        });
    }

    animate() {
        this.anIndex += 1;
        if (this.anIndex >= this.anFrames) this.anIndex = 0;
        this.render();
    }

    getList() {
        return this.list;
    }
}

export default new ItemSelection();
