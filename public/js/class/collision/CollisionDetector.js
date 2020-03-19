export class CollisionDetector {
    constructor(map) {
        this.map = map;
        this.mapCollisionReduction = 5;
    }


    mapPlayerCollision(x, y, size) {

        let playerX = x;
        let playerY = y;
        size /= 2;
        let collReduction = this.mapCollisionReduction;

        let isColl = [];

        this.map.coords.forEach((v) => {

            //y
            if ((playerX + size> v.x && playerX + size < v.x + v.w)
                || (playerX - size > v.x && playerX - size < v.x + v.w)) {

                if (playerY - size <= v.y && playerY + size >= v.y) {

                    let topCorrection = Math.abs(v.y - (playerY - size) - size*2);
                    if (isColl.length < 2 && topCorrection < 10) {
                        isColl.push({ type : "top", amount: topCorrection });
                    } 

                } else if (playerY - size <= v.y + v.h && playerY + size >= v.y) {

                    let bottomCorrection = Math.abs((v.y + v.h) - (playerY - size));
                    if (isColl.length < 2 && bottomCorrection < 10) {
                        isColl.push({ type : "bottom", amount: bottomCorrection });
                    } 

                }
            }

            //x
            if ((playerY + size > v.y && playerY + size < v.y + v.h)
                || (playerY - size > v.y && playerY - size < v.y + v.h)) {

                if (playerX - size <= v.x && playerX + size >= v.x) {
     
                    let leftCorrection = Math.abs(v.x - (playerX - size) - size*2);
                    if (isColl.length < 2 && leftCorrection < 10) {
                        isColl.push({ type : "left", amount: leftCorrection });
                    } 

                } else if (playerX - size <= v.x + v.w && playerX + size >= v.x) {

                    let rightCorrection = Math.abs((v.x + v.w) - (playerX - size));
                    if (isColl.length < 2 && rightCorrection < 10) {
                        isColl.push({ type : "right", amount: rightCorrection });
                    } 

                }
            }
        })

/*
        if (playerX + size / 2 > this.map.width) {
            isColl.add('left');
        } else if (playerX - size / 2 < 0) {
            isColl.add('right');
        }

        if (playerY + size / 2 > this.map.height) {
            isColl.add('top');
        } else if (playerY - size / 2 < 0) {
            isColl.add('bottom');
        }
*/

        return isColl;
    }


    playerMissileCollision(rect1, rect2) {
        if (rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.height + rect1.y > rect2.y) {
                
            return true;

         } else {
             
            return false
         }
    }


    segSegCollision(px0, py0, px1, py1, px2, py2, px3, py3) {

        let s1_x, s1_y, s2_x, s2_y;
        s1_x = px1 - px0;
        s1_y = py1 - py0;
        s2_x = px3 - px2;
        s2_y = py3 - py2;

        let s, t;
        s = (-s1_y * (px0 - px2) + s1_x * (py0 - py2)) / (-s2_x * s1_y + s1_x * s2_y);
        t = (s2_x * (py0 - py2) - s2_y * (px0 - px2)) / (-s2_x * s1_y + s1_x * s2_y);

        let interX = px0 + (t * (px1 - px0));
        let interY = py0 + (t * (py1 - py0));

        if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
            return { x: interX, y: interY };
        } else {
            return false;
        }
    }


    pointDistance(x0, y0, x1, y1) {
        return Math.hypot(x0 - x1, y0 - y1);
    }
}