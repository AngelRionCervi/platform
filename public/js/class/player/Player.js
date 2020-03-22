export class Player {
    constructor(drawingTools, collision) {
        this.drawingTools = drawingTools;
        this.collision = collision;
        this.width = 24;
        this.height = 24;
        this.x = 256;
        this.y = 0;
        this.xAccel = 0.3;
        this.yAccel = 0.3;
        this.speed = 1;
        this.vx = 0;
        this.vy = 0;
        this.friction = 0.9;
        this.airFriction = 0.6;
        this.jumping = false;
        this.gravity = 0.2;
        this.inAir = false;
        this.jumpVel = 50;
        this.xBaseOffset = 800 * 33 / 100;
        this.xMaxOffset = 800 * 66 / 100;
        this.offsetShiftAmount = 2;
        this.xOffset = 256;
        this.lastXdir;
        this.centerX = () => this.x + this.width / 2;
        this.centerY = () => this.y + this.height / 2;
    }


    update(direction, jump) {
        let isColl = this.collision.mapPlayerCollision(this.centerX(), this.centerY(), this.width);

        if (isColl.find(el => el.type === "top") && this.jumping && this.vy > 0) {
            this.jumping = false;
        }

        if (isColl.length === 0) {
            this.inAir = true;
        }
        else {
            this.inAir = false;
        }

        if (jump && !this.jumping && !this.inAir) {
            this.jumping = true;
            this.vy -= this.jumpVel;
        }

        if (direction.x > 0) {
            this.vx += this.xAccel;
            if (this.xOffset > this.xBaseOffset && this.xOffset <= this.xMaxOffset && !isColl.find(el => el.type === "left")) {
                this.xOffset -= this.offsetShiftAmount;
            }
        }
        else if (direction.x < 0) {
            this.vx -= this.xAccel;
            if (this.xOffset < this.xMaxOffset && !isColl.find(el => el.type === "right")) {
                this.xOffset += this.offsetShiftAmount;
            }
        }

        console.log(this.xOffset);
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= this.friction;
        this.vy *= this.friction;

        this.mapCollHandler(isColl);

        this.lastXdir = direction.x;
    }


    draw(lInc, rInc) {
        let inc = 0;
        if (lInc) inc = lInc;
        if (rInc) inc = rInc;
        this.drawingTools.rect(this.xOffset + inc, 600 - 64 - this.width, this.width, this.height, 0, 0, 0, 0, 0, "red");

    }


    mapCollHandler(isColl) {
        isColl.forEach((coll) => {
            if (coll.type === 'left') {
                this.x -= (coll.amount + this.vx);
            }
            else if (coll.type === 'right') {
                this.x += (coll.amount - this.vx);
            }
            else if (coll.type === 'top') {
                this.y -= (coll.amount + this.vy);
            }
            else if (coll.type === 'bottom') {
                this.y += (coll.amount - this.vy);
            }
        })
    }

}