import { Emitter } from "/mapEditor/js/lib/Emitter.js";

export class GameObjectListInteraction {
    constructor() {
        this.emitter = new Emitter();
    }

    handleGameObjectClick(e, object) {
        this.emitter.emit("game_object_click", object);
    }

    handleGameObjectContextClick(e, object) {
        e.preventDefault();
        const coord = {
            x: e.pageX,
            y: e.pageY,
        };

        this.emitter.emit("game_object_context_toggle", { object, coord });

        return false;
    }
}
