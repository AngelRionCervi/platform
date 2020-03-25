const canvas = document.getElementById('mapEditorCanvas');
const ctx = canvas.getContext('2d');

import { Emitter } from "/js/lib/Emitter.js";
import { Interactions } from "/js/class/grid/Interactions.js";
import { Grid } from "/js/class/grid/Grid.js";
import { MapDownloader } from "/js/class/download/MapDownloader.js";

const interactions = new Interactions();

const grid = new Grid(canvas, ctx);
const mapDownloader = new MapDownloader(canvas);

grid.create();

interactions.emitter.on('add_cell_by_cursor', (data) => {
    grid.addCellByCursor(data.detail);
})

interactions.emitter.on('remove_cell_by_cursor', (data) => {
    grid.removeCellByCursor(data.detail);
})

interactions.emitter.on('add_row', () => {
    grid.addRow();
})

interactions.emitter.on('remove_row', () => {
    grid.removeRow();
})

interactions.emitter.on('add_col', () => {
    grid.addCol();
})

interactions.emitter.on('remove_col', () => {
    grid.removeCol();
})

interactions.emitter.on('dl_map', () => {
    const rndmName = 'map_' + Date.now() + Math.random();
    const map = grid.getMap();
    mapDownloader.downloadMap(map, rndmName);
})









