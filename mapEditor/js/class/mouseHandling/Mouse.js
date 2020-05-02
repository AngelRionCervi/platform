import { getCanvas } from "../general/canvasRef.js";
const canva = getCanvas();

export class Mouse {
    constructor() {
        this.lastPos = null;
    }

    getCursorPos(evt = null) {
        if (evt) {
            const rect = canva.getBoundingClientRect();
            this.lastPos = {
                x: ((evt.clientX - rect.left) / (rect.right - rect.left)) * canva.offsetWidth,
                y: ((evt.clientY - rect.top) / (rect.bottom - rect.top)) * canva.offsetHeight,
            };
        }
        return this.lastPos;
    }
}
