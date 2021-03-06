import gridProps from "./GridProps.js";
import camera from "../../camera/Camera.js";
import { _G } from "../../general/globals.js";
import { helperGridContainer } from "../../general/canvasRef.js";
import * as _H from "../../../lib/helpers.js";

const { vpWidth, vpHeight } = camera.getViewPort();
const ts = camera.toScreen.bind(camera);

const gridSprite = new PIXI.Sprite();
helperGridContainer.addChild(gridSprite);

// canvas implementation is faster ??
class HelperGrid {
    constructor() {
        this.buffer = document.createElement("canvas");
        this.ctx = this.buffer.getContext("2d");
        this.buffer.width = vpWidth;
        this.buffer.height = vpHeight;
    }

    build() {
        const camCoord = camera.getCoords();
        const flatCells = gridProps.getRenderedCells();
        const xs = flatCells.map((row) => row[0].x);
        const ys = flatCells[0].map((col) => col.y);
        const { gw, gh } = gridProps.getDim();

        this.ctx.clear(true);
        this.ctx.setLineDash(_G.gridDashes);
        this.ctx.strokeStyle = _G.gridColor;

        for (let u = 0, len = xs.length; u < len; u++) {
            this.ctx.beginPath();
            this.ctx.moveTo(camCoord.x + ts(xs[u]) + 0.5, camCoord.y);
            this.ctx.lineTo(camCoord.x + ts(xs[u]) + 0.5, camCoord.y + ts(gh));
            this.ctx.stroke();
        }

        for (let u = 0, len = ys.length; u < len; u++) {
            this.ctx.beginPath();
            this.ctx.moveTo(camCoord.x, camCoord.y + ts(ys[u]) + 0.5);
            this.ctx.lineTo(camCoord.x + ts(gw), camCoord.y + ts(ys[u]) + 0.5);
            this.ctx.stroke();
        }

        const texture = new PIXI.Texture.from(this.buffer);
        gridSprite.texture = texture;
        gridSprite.texture.update();
    }

    getBuffer() {
        return buffer;
    }
}

export default HelperGrid;
/*

const pixiDrawing = new PixiDrawing(app);

const { vpWidth, vpHeight } = camera.getViewPort();
const ts = camera.toScreen.bind(camera);
const line = new PIXI.Graphics();
let sprite = new PIXI.Sprite();
helperGridContainer.addChild(sprite);

export default class HelperGrid {
    constructor() {
        //this.lastCamCoords = { x: null, y: null };
    }

    build() {
        console.log("building grid blyat")
        const camCoord = camera.getCoords();
        //if (this.lastCamCoords.x === camCoord.x && this.lastCamCoords.y === camCoord.y && this.lastZoom)
        //this.lastCamCoords = camCoord;
        const flatCells = gridProps.getRenderedCells();
        const xs = flatCells.map((row) => row[0].x);
        const ys = flatCells[0].map((col) => col.y);
        const { gw, gh } = gridProps.getDim();
        line.clear();

        line.lineStyle(1, 0x000000);
        //this.ctx.clear(true);
        //this.ctx.setLineDash(_G.gridDashes);

        for (let u = 0, len = xs.length; u < len; u++) {
            line.moveTo(0.5 + ts(xs[u]), 0);
            line.drawDashLine(0.5 + ts(xs[u]), ts(gh), 2, 3);
            line.closePath();
        }

        for (let u = 0, len = ys.length; u < len; u++) {
            line.moveTo(0, 0.5 + ts(ys[u]));
            line.drawDashLine(ts(gw), 0.5 + ts(ys[u]), 2, 3);
            line.closePath();
        }
        
        const texture = app.renderer.generateTexture(line);
        sprite.texture = texture;
        

        // try commenting that to see Uint16 overflow
        
        //const baseTexture = new PIXI.BaseTexture.from(this.buffer);
        //pixiDrawing.on(helperGridContainer).drawImage(baseTexture, 0, 0, vpWidth, vpHeight).done();
    }
}
*/
