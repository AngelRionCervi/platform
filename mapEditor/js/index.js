const canvas = document.getElementById('mapEditorCanvas');
const ctx = canvas.getContext('2d');

import { Grid } from "/js/class/grid/Grid.js";
import { Mouse } from "/js/class/mouseHandling/Mouse.js";
import { MapDownloader } from "/js/class/download/MapDownloader.js";

let grid = new Grid(canvas, ctx);
let mouse = new Mouse(canvas);
let mapDownloader = new MapDownloader(canvas);

grid.create();

const dlButton = document.getElementById('dlMapBtn');

dlButton.addEventListener('click', () => {
    let rndmName = Date.now() + Math.random();
    let map = grid.getMap();

    mapDownloader.downloadMap(map, rndmName);
})

canvas.addEventListener('mousedown', (evt) => {
    evt.preventDefault();
    let cursorPos = mouse.getCursorPos(evt);
    switch(evt.button) {
        case 0:
            grid.fillCellByCursor(cursorPos);
            break;
        case 2:
            grid.removeCellByCursor(cursorPos);
            break;
    }
});

canvas.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    return false;
});

add_row.addEventListener('click', () => {
    grid.addRow();
})

add_col.addEventListener('click', () => {
    grid.addCol();
})






