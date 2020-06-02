import { Emitter } from "/mapEditor/js/lib/Emitter.js";

export class Keyboard {
    constructor() {
        this.emitter = new Emitter();
        this.keys = {
            ctrl: false,
            lAlt: false,
            lShift: false
        };
    }

    listen() {
        document.addEventListener("keydown", (e) => {
            e.preventDefault();
            this.keys[this.getRef(e.keyCode)] = true;
            this.emitKeys();
        });
        document.addEventListener("keyup", (e) => {
            e.preventDefault();
            this.keys[this.getRef(e.keyCode)] = false;
            this.emitKeys();
        });
    }

    getRef(keyCode) {
        switch (keyCode) {
            case 16:
                return "lShift";
            case 17:
                return "ctrl";
            case 18:
                return "lAlt";
        }
    }

    act(key) {
        return this.keys[key];
    }

    emitKeys() {
        this.emitter.emit("keyboard_input_change", this.keys);
    }

    initKeys() {
        return this.keys;
    }
}
