import { Emitter } from "/mapEditor/js/lib/Emitter.js";

export class Keyboard {
    constructor() {
        this.emitter = new Emitter();
        this.keys = {
            ctrl: false,
        };
    }

    listen() {
        document.addEventListener("keydown", (e) => {
            this.keys[this.getRef(e.keyCode)] = true;
            this.emitKeys();
        });
        document.addEventListener("keyup", (e) => {
            this.keys[this.getRef(e.keyCode)] = false;
            this.emitKeys();
        });
    }

    getRef(keyCode) {
        switch (keyCode) {
            case 17:
                return "ctrl";
        }
    }

    emitKeys() {
        this.emitter.emit('keyboard_input_change', this.keys)
    }

    initKeys() {
        return this.keys;
    }
}
