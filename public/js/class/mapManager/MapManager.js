export class MapManager {
    constructor(canvas, ctx, drawingTools, rndmInteger) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.drawingTools = drawingTools;
        this.rndmInteger = rndmInteger;
        this.blockColor = "black";
        this.spriteSize = 64;
        this.groundTileSize = 320;
        this.totalGroundType = 3;
        this.map = {"width":1344,"height":960,"coords":[{"x":64,"y":640,"w":64,"h":64},{"x":64,"y":832,"w":64,"h":64},{"x":1088,"y":448,"w":64,"h":128},{"x":512,"y":448,"w":128,"h":128},{"x":0,"y":0,"w":64,"h":64},{"x":0,"y":704,"w":64,"h":128},{"x":0,"y":896,"w":64,"h":64},{"x":1280,"y":256,"w":64,"h":64},{"x":1216,"y":320,"w":64,"h":64},{"x":1024,"y":384,"w":64,"h":64},{"x":1024,"y":896,"w":320,"h":64},{"x":1152,"y":384,"w":64,"h":64},{"x":512,"y":576,"w":64,"h":64},{"x":448,"y":640,"w":128,"h":64},{"x":896,"y":832,"w":64,"h":64},{"x":128,"y":896,"w":768,"h":64},{"x":0,"y":0,"w":1,"h":1344},{"x":0,"y":960,"w":1344,"h":1},{"x":0,"y":0,"w":1344,"h":1},{"x":1344,"y":0,"w":1,"h":960}],"debugColliders":[]}
        this.groundTilesNbr = [];

        for (let i = 0; i < this.map.width; i += this.groundTileSize) {
            for (let j = 0; j < this.map.height; j += this.groundTileSize) {
                this.groundTilesNbr.push(this.rndmInteger(1, this.totalGroundType));
            }
        }

        this.groundTilesNbr.push(this.rndmInteger(1, this.totalGroundType)) // we actually need 1 more;
    }

    renderMap(map, shakeX, shakeY) {
        let width = map.width;
        let height = map.height;
        let blockCoords = map.coords;

        this.canvas.width = width;
        this.canvas.height = height;

        this.ctx.imageSmoothingEnabled = false;

        let gIndex = 0;
        for (let i = 0; i < width; i += this.groundTileSize) {
            for (let j = 0; j < height; j += this.groundTileSize) {
                gIndex++;
                this.drawingTools.drawSprite('ground_' + this.groundTilesNbr[gIndex], i + shakeX, j + shakeY);
            }
        }

        blockCoords.forEach(v => {
            if (v.w > 1 && v.h > 1) {
                for (let i = v.x; i < v.x + v.w; i += this.spriteSize) {
                    for (let j = v.y; j < v.y + v.h; j += this.spriteSize) {
                        this.drawingTools.drawSprite('wall', i + shakeX, j + shakeY);
                    }
                }
            }
        });
        //this.debugColliders(map.debugColliders);
    }

    debugColliders(colliders) {

        colliders.forEach((collider) => {
            collider.forEach((v) => {
                let fillStyle;
                if (v.type === "yWall") {
                    fillStyle = "red";
                } else {
                    fillStyle = "green";
                }
                this.ctx.beginPath();
                this.ctx.rect(v.x, v.y, v.w, v.h);
                this.ctx.fillStyle = fillStyle;
                this.ctx.closePath();
                this.ctx.fill();
            })
        })
    }

    getMap() {
        return this.map;
    }
}