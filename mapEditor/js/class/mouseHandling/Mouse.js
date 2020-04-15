export class Mouse {
    constructor(grid) {
        this.grid = grid;
    }

    getCursorPos(evt) {
        const rect = this.grid.getBoundingClientRect();
        return {
            x: (evt.clientX - rect.left) / (rect.right - rect.left) * this.grid.offsetWidth,
            y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * this.grid.offsetHeight
        };
    }
}