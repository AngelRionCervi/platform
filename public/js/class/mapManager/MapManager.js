export class MapManager {
    constructor(canvas, ctx, drawingTools, rndmInteger) {
        this.et = new EventTarget();
        this.events = {
            rCamBlock: new CustomEvent('rCamBlock', {detail: {x: 'lol'}}),
        };
        this.canvas = canvas;
        this.ctx = ctx;
        this.drawingTools = drawingTools;
        this.rndmInteger = rndmInteger;
        this.blockColor = "black";
        this.spriteSize = 64;
        this.groundTileSize = 320;
        this.totalGroundType = 3;
        this.rXstart = 0;
        this.rYstart = 0;
        this.playerRinc = 0;
        this.playerLinc = 0;
        this.map = {"width":1664,"height":768,"coords":[{"x":0,"y":384,"w":64,"h":320},{"x":768,"y":576,"w":64,"h":128},{"x":1600,"y":384,"w":64,"h":320},{"x":0,"y":704,"w":1664,"h":64},{"x":1280,"y":576,"w":64,"h":64},{"x":256,"y":640,"w":64,"h":64},{"x":512,"y":640,"w":64,"h":64},{"x":1216,"y":640,"w":128,"h":64},{"x":0,"y":0,"w":1,"h":1664},{"x":0,"y":768,"w":1664,"h":1},{"x":0,"y":0,"w":1664,"h":1},{"x":1664,"y":0,"w":1,"h":768}],"debugColliders":[]};
        this.groundTilesNbr = [];
        this.rCamToggle = false;
        this.leftStartOffset = 4;

        for (let i = 0; i < this.map.width; i += this.groundTileSize) {
            for (let j = 0; j < this.map.height; j += this.groundTileSize) {
                this.groundTilesNbr.push(this.rndmInteger(1, this.totalGroundType));
            }
        }
        this.groundTilesNbr.push(this.rndmInteger(1, this.totalGroundType)) // we actually need 1 more;
    }

    renderMap(player, map, shakeX, shakeY, xOffset) {
        let width = 800;
        let height = 600;
        let blockCoords = map.coords;

        this.canvas.width = width;
        this.canvas.height = height;

        this.ctx.imageSmoothingEnabled = false;

        let endSceneX = (player.x - xOffset + width) - this.map.width;
        //let endSceneY = (player.y + height - this.spriteSize) - this.map.height;

        if (endSceneX < 0) {
            this.rXstart = player.x - xOffset;
        } else {
            this.playerLinc = 0;
            this.playerRinc = endSceneX;
        }

        if (this.rXstart <= 0) {
            this.playerRinc = 0;
            this.playerLinc = this.rXstart;
            this.rXstart = 0;
        } 
        
        this.rYstart = player.y - (height - player.height - this.spriteSize);

       
        let gIndex = 0;
        for (let i = -this.rXstart; i < width; i += this.groundTileSize) {
            for (let j = -this.rYstart; j < height; j += this.groundTileSize) {
                gIndex++;
                this.drawingTools.drawSprite('ground_' + this.groundTilesNbr[gIndex], i + shakeX, j + shakeY);
            }
        }
        
        blockCoords.forEach(v => {
            if (v.w > 1 && v.h > 1) {
                for (let i = v.x - this.rXstart; i < v.x - this.rXstart + v.w; i += this.spriteSize) {
                    for (let j = v.y - this.rYstart; j < v.y - this.rYstart + v.h; j += this.spriteSize) {
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