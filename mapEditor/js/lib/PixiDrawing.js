function hex2Hex0x(hex) {
    return "0x" + hex.slice(1, hex.length);
}

function rgba2hex(orig) {
    let a,
        rgb = orig.replace(/\s/g, "").match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i),
        alpha = ((rgb && rgb[4]) || "").trim(),
        hex = rgb
            ? (rgb[1] | (1 << 8)).toString(16).slice(1) +
              (rgb[2] | (1 << 8)).toString(16).slice(1) +
              (rgb[3] | (1 << 8)).toString(16).slice(1)
            : orig;

    if (alpha !== "") {
        a = alpha;
    } else {
        a = 0o1;
    }
    // multiply before convert to HEX
    a = ((a * 255) | (1 << 8)).toString(16).slice(1);
    hex = hex + a;

    return hex.substring(0, 1) + "x" + hex.substring(index + 2);
}

export default class PixiDrawing {
    constructor(app) {
        this.container = null;
        this.baseTex = null;
        this.texture = null;
        this.sprite = null;
        this.spriteCoord = null;
        this.app = app;
    }

    on(container) {
        this.container = container;
        return this;
    }

    drawImage(
        baseTex,
        srcX = undefined,
        srcY = undefined,
        srcWidth = undefined,
        srcHeight = undefined,
        dstX = undefined,
        dstY = undefined,
        dstWidth = undefined,
        dstHeight = undefined,
        rotDeg = undefined,
        rotPivotX = undefined,
        rotPivotY = undefined
    ) {
        if (!this.container) {
            throw new Error("No container specified.");
        }
        if (srcX === undefined) {
            srcX = 0;
        }
        if (srcY === undefined) {
            srcY = 0;
        }
        if (dstX === undefined) {
            dstX = srcX;
            srcX = 0;
        }
        if (dstY === undefined) {
            dstY = srcY;
            srcY = 0;
        }
        if (srcWidth === undefined) {
            srcWidth = baseTex.width;
        }
        if (srcHeight === undefined) {
            srcHeight = baseTex.height;
        }
        if (dstWidth === undefined) {
            dstWidth = srcWidth;
            srcWidth = baseTex.width;
        }
        if (dstHeight === undefined) {
            dstHeight = srcHeight;
            srcHeight = baseTex.height;
        }
        if (rotDeg === undefined) {
            rotDeg = 0;
        }
        if (rotPivotX === undefined) {
            rotPivotX = 0;
        }
        if (rotPivotY === undefined) {
            rotPivotY = 0;
        }
        if (srcX + srcWidth > baseTex.width) {
            srcWidth -= srcX + srcWidth - baseTex.width;
        }
        if (srcY + srcHeight > baseTex.height) {
            srcHeight -= srcY + srcHeight - baseTex.height;
        }

        const trim = new PIXI.Rectangle(srcX, srcY, srcWidth, srcHeight);
        const texture = new PIXI.Texture(baseTex, trim);
        const sprite = new PIXI.Sprite(texture);
        sprite.texture.update();

        sprite.x = dstX;
        sprite.y = dstY;
        sprite.width = dstWidth;
        sprite.height = dstHeight;

        if (rotDeg !== 0) {
            this.rotate(rotDeg, rotPivotX, rotPivotY);
        }

        this.baseTex = baseTex;
        this.texture = texture;
        this.sprite = sprite;
        this.spriteCoord = { x: dstX, y: dstY };

        return this;
    }

    drawRect(
        x,
        y,
        width = 50,
        height = 50,
        color = "#ff0000",
        empty = false,
        stroke = false,
        strokeColor = "#00ff00",
        strokeWidth = 4
    ) {
        if (typeof color === "string") {
            if (color[0] === "#") {
                color = hex2Hex0x(color);
            }
            if (color.includes("rgb")) {
                color = rgba2hex(color);
            }
        }
        if (typeof strokeColor === "string") {
            if (strokeColor[0] === "#") {
                strokeColor = hex2Hex0x(strokeColor);
            }
            if (strokeColor.includes("rgb")) {
                strokeColor = rgba2hex(strokeColor);
            }
        }
        const rectangle = new PIXI.Graphics();
        stroke && rectangle.lineStyle(8, strokeWidth, 1);
        !empty && rectangle.beginFill(color);
        rectangle.drawRect(0, 0, width, height);
        !empty && rectangle.endFill();
        const texture = this.app.renderer.generateTexture(rectangle);
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.x = x;
        this.sprite.y = y;
        return this;
    }

    rotate(deg, pivotX = undefined, pivotY = undefined) {
        if (!this.sprite) {
            throw new Error("No sprites specified.");
        }

        if (deg === undefined) {
            deg = 0;
        }
        if (pivotX === undefined) {
            pivotX = 0;
        }
        if (pivotY === undefined) {
            pivotY = 0;
        }

        if (pivotX === "center") {
            this.sprite.anchor.x = 0.5; // doesnt work with pivot and this.sprite.width / 2 ...
            this.sprite.anchor.y = 0.5;
            this.sprite.x += this.sprite.width / 2;
            this.sprite.y += this.sprite.height / 2;
        } else {
            this.sprite.anchor.x = pivotX / this.sprite.width;
            this.sprite.anchor.y = pivotY / this.sprite.height;
        }
        this.sprite.rotation = (deg * Math.PI) / 180;

        return this;
    }

    move(x, y) {
        this.sprite.x = x;
        this.sprite.y = y;
        return this;
    }

    clip(x, y, width, height) {
        const trim = new PIXI.Rectangle(x, y, width, height);
        const texture = new PIXI.Texture(this.baseTex, trim);
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.x = this.spriteCoord.x;
        this.sprite.y = this.spriteCoord.y;
        return this;
    }

    resize(width, height) {
        this.sprite.width = width;
        this.sprite.height = height;
        return this;
    }

    done() {
        this.container.addChild(this.sprite);
    }

    getSprite() {
        return this.sprite;
    }
}
