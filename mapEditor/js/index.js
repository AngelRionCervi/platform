const canvas = document.getElementById('mapEditorCanvas');
const ctx = canvas.getContext('2d');

import { Emitter } from "/mapEditor/js/lib/Emitter.js";
import { Project } from "/mapEditor/js/class/project/userProject.js";
import { GridInteraction } from "/mapEditor/js/class/grid/GridInteraction.js";
import { Grid } from "/mapEditor/js/class/grid/Grid.js";
import { MapDownloader } from "/mapEditor/js/class/download/MapDownloader.js";
import { Palette } from "/mapEditor/js/class/palette/Palette.js"
import { PaletteInteraction } from "/mapEditor/js/class/palette/PaletteInteraction.js"

const gridInteraction = new GridInteraction();
const grid = new Grid(canvas, ctx);

const paletteInteraction = new PaletteInteraction();
const palette = new Palette(paletteInteraction);
const mapDownloader = new MapDownloader(canvas);

let project;

grid.create();
paletteInteraction.watchDrop();
paletteInteraction.watchDirectoryBack();

gridInteraction.emitter.on('add_cell_by_cursor', (data) => {
    const asset = paletteInteraction.getCurrentPaletteCell();
    grid.addCellByCursor(data.detail, asset);
})

gridInteraction.emitter.on('remove_cell_by_cursor', (data) => {
    grid.removeCellByCursor(data.detail);
})

gridInteraction.emitter.on('add_row', () => {
    grid.addRow();
})

gridInteraction.emitter.on('remove_row', () => {
    grid.removeRow();
})

gridInteraction.emitter.on('add_col', () => {
    grid.addCol();
})

gridInteraction.emitter.on('remove_col', () => {
    grid.removeCol();
})

gridInteraction.emitter.on('dl_map', () => {
    const rndmName = 'map_' + Date.now() + Math.random();
    mapDownloader.downloadMap(map, rndmName);
})



paletteInteraction.emitter.on('palette_assets_received', async (files) => {
    const assets = await palette.loadAssets(files);
    project = new Project(assets.projectID);
    palette.buildFrom(assets.res, assets.rootDir, assets.fullPath);
})

paletteInteraction.emitter.on('palette_asset_change', (targetEl, asset) => {
    palette.styleSelectedCell(targetEl.detail);
});

paletteInteraction.emitter.on('palette_directory_back', () => {
    const assets = palette.getAssets();
    const dirInfo = palette.getDirInfo();
    if (project.getID() !== dirInfo.prevDir.slice(0, -1)) {
        palette.buildFrom(assets, dirInfo.prevDir, dirInfo.absCurPath, true);
    }
});

fetch('http://localhost:5000/getAssets')
    .then((res) => {
        return res.json();
    })
    .then((assets) => {
        project = new Project(assets.projectID);
        palette.buildFrom(assets.res, assets.rootDir, assets.fullPath);
    })
/*
document.addEventListener('drop', function(e) {
    e.stopPropagation()
    e.preventDefault();
    console.log(e)
})*/








