export class Keyboard {
    constructor(canvas) {
        this.canvas = canvas;
        this.pressedDirKeys = [0, 0, 0, 0];
        this.spaceBarPress = false;
    }

    getDirection(evt) {

        this.registerDirKeys(evt);

        let directions = { x: 0, y: 0 };

        if (this.pressedDirKeys[0]) {
            directions.y = 1;
        }
        if (this.pressedDirKeys[1]) {
            directions.y = -1;
        }
        if (this.pressedDirKeys[2]) {
            directions.x = -1;
        }
        if (this.pressedDirKeys[3]) {
            directions.x = 1;
        }


        if (this.pressedDirKeys[0] && this.pressedDirKeys[1]) { // z and s
            directions.y = 0;
        } else if (this.pressedDirKeys[2] && this.pressedDirKeys[3]) { // q and d
            directions.x = 0;
        }


        return directions;
    }

    getSpaceBar() {
        return this.spaceBarPress;
    }

    registerDirKeys(evt) {
        
        if (evt.type === "keydown") {
            
            switch (evt.key) {
                case 'z':
                    this.pressedDirKeys[0] = 1;
                    break;
                case 's':
                    this.pressedDirKeys[1] = 1;
                    break;
                case 'q':
                    this.pressedDirKeys[2] = 1;
                    break;
                case 'd':
                    this.pressedDirKeys[3] = 1;
                    break;
                case ' ':
                    this.spaceBarPress = true;
                    break;
            }

        } else if (evt.type === "keyup") {

            switch (evt.key) {
                case 'z':
                    this.pressedDirKeys[0] = 0;
                    break;
                case 's':
                    this.pressedDirKeys[1] = 0;
                    break;
                case 'q':
                    this.pressedDirKeys[2] = 0;
                    break;
                case 'd':
                    this.pressedDirKeys[3] = 0;
                    break;
                case ' ':
                    this.spaceBarPress = false;
                    break;
            }
        }
    }
}