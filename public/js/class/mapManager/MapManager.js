export class MapManager {
    constructor(canvas, ctx, drawingTools, viewport) {
        this.et = new EventTarget();
        this.events = {
            rCamBlock: new CustomEvent('rCamBlock', { detail: { x: 'lol' } }),
        };
        this.canvas = canvas;
        this.ctx = ctx;
        this.drawingTools = drawingTools;
        this.blockColor = "black";
        this.spriteSize = 64;
        this.groundTileSize = 320;
        this.totalGroundType = 3;
        this.rXstart = 0;
        this.rYstart = 0;
        this.playerRinc = 0;
        this.playerLinc = 0;
        this.playerYinc = 0;
        this.map = { "width": 1664, "height": 768, "coords": [{ "x": 0, "y": 384, "w": 64, "h": 320 }, { "x": 768, "y": 576, "w": 64, "h": 128 }, { "x": 1600, "y": 384, "w": 64, "h": 320 }, { "x": 0, "y": 704, "w": 1664, "h": 64 }, { "x": 1280, "y": 576, "w": 64, "h": 64 }, { "x": 256, "y": 640, "w": 64, "h": 64 }, { "x": 512, "y": 640, "w": 64, "h": 64 }, { "x": 1216, "y": 640, "w": 128, "h": 64 }, { "x": 0, "y": 0, "w": 1, "h": 1664 }, { "x": 0, "y": 768, "w": 1664, "h": 1 }, { "x": 0, "y": 0, "w": 1664, "h": 1 }, { "x": 1664, "y": 0, "w": 1, "h": 768 }], "debugColliders": [] };
        this.groundTilesNbr = [];
        this.rCamToggle = false;
        this.viewPortWidth = viewport.w;
        this.viewPortHeight = viewport.h;
        this.canvas.width = this.viewPortWidth;
        this.canvas.height = this.viewPortHeight;
        /*
                for (let i = 0; i < this.map.width; i += this.groundTileSize) {
                    for (let j = 0; j < this.map.height; j += this.groundTileSize) {
                        this.groundTilesNbr.push(0);
                    }
                }
                this.groundTilesNbr.push(0) // we actually need 1 more;*/
    }

    renderMap(player, map, shakeX, shakeY, xOffset, yOffset) {

        this.ctx.imageSmoothingEnabled = false;

        let endSceneX = (player.x - xOffset + this.viewPortWidth) - this.map.width;
        //let endSceneY = (player.y + yOffset + this.viewPortHeight) - this.map.height;

        let scDrawXstart;

        if (endSceneX < 0) {
            scDrawXstart = player.x - xOffset;
        } else {
            this.playerLinc = 0;
            this.playerRinc = endSceneX;
            scDrawXstart = this.map.width - this.viewPortWidth;
        }

        if (scDrawXstart <= 0) {
            this.playerRinc = 0;
            this.playerLinc = scDrawXstart;
            scDrawXstart = 0;
        }

        let scDrawYstart = player.y - (this.viewPortHeight - player.height - yOffset);
        //console.log(scDrawYstart)

        if (scDrawYstart <= 0) {
            this.playerYinc = scDrawYstart;
            scDrawYstart = 0;
        }

        for (let i = -scDrawXstart; i < this.viewPortWidth; i += this.groundTileSize) {
            for (let j = -scDrawYstart; j < this.viewPortHeight; j += this.groundTileSize) {
                this.drawingTools.drawSprite('ground_' + 1, i + shakeX, j + shakeY);
            }
        }

        map.coords.forEach(v => {
            if (v.w > 1 && v.h > 1) {
                for (let i = v.x - scDrawXstart; i < v.x - scDrawXstart + v.w; i += this.spriteSize) {
                    for (let j = v.y - scDrawYstart; j < v.y - scDrawYstart + v.h; j += this.spriteSize) {
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