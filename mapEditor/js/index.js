const canvas = document.getElementById('mapEditorCanvas');
const ctx = canvas.getContext('2d');

import { Emitter } from "/js/lib/Emitter.js";
import { Interactions } from "/js/class/grid/Interactions.js";
import { Grid } from "/js/class/grid/Grid.js";
import { MapDownloader } from "/js/class/download/MapDownloader.js";

const interactions = new Interactions();

let grid = new Grid(canvas, ctx);
let mapDownloader = new MapDownloader(canvas);

grid.create();

interactions.emitter.on('add_cell_by_cursor', (data) => {
    grid.addCellByCursor(data.detail);
})

interactions.emitter.on('remove_cell_by_cursor', (data) => {
    grid.removeCellByCursor(data.detail);
})





// add to Interactions
const dlButton = document.getElementById('dlMapBtn');

dlButton.addEventListener('click', () => {
    let rndmName = 'map_' + Date.now() + Math.random();
    let map = grid.getMap();
    mapDownloader.downloadMap(map, rndmName);
})

add_row.addEventListener('click', () => {
    grid.addRow();
})

add_col.addEventListener('click', () => {
    grid.addCol();
})

remove_row.addEventListener('click', () => {
    grid.removeRow();
})

remove_col.addEventListener('click', () => {
    grid.removeCol();
})






