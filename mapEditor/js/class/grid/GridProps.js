import { _G } from "../../lib/globals.js";

export default class GridProps {
    constructor() {
        this.gridWidth = _G.gridWidth;
        this.gridHeight = _G.gridHeight;
        this.blockSize = _G.blockSize;
        this.gridTiles = [];
        this.sceneBuffer = document.createElement("canvas");
    }

    getBlockSize() {
        return this.blockSize;
    }
    setBlockSize(size) {
        this.blockSize = size;
        return this;
    }
    setWidth(width) {
        this.gridWidth = width;
        return this;
    }
    setHeight(height) {
        this.gridHeight = height;
        return this;
    }
    getWidth() {
        return this.gridWidth;
    }
    getHeight() {
        return this.gridHeight;
    }
    setTiles(tiles) {
        this.gridTiles = tiles;
        return this;
    }
    getTiles() {
        return this.gridTiles;
    }
    setRenderedCells(renderedCells) {
        this.renderedCells = renderedCells;
    }
    getRenderedCells() {
        return this.renderedCells;
    }
    newColRight(newCol) {
        this.gridTiles.push(newCol);
        return this;
    }
    newColLeft(newCol) {
        this.gridTiles.unshift(newCol);
        return this;
    }
    removeColRight() {
        this.gridTiles.pop();
        return this;
    }
    removeColLeft() {
        this.gridTiles.shift();
        return this;
    }
    newRowBottom(row) {
        this.gridTiles.forEach((col, i) => {
            col.push(row[i]);
        });
        return this;
    }
    newRowTop(row) {
        this.gridTiles.forEach((col, i) => {
            col.unshift(row[i]);
        });
        return this;
    }
    removeRowBottom() {
        this.gridTiles.forEach((col) => {
            col.pop();
        });
        return this;
    }
    removeRowTop() {
        this.gridTiles.forEach((col) => {
            col.shift();
        });
        return this;
    }
    moveAllRight(times) {
        this.gridTiles.flat().forEach((cell) => {
            cell.moveRight(times);
        });
        return this;
    }
    moveAllLeft(times) {
        this.gridTiles.flat().forEach((cell) => {
            cell.moveLeft(times);
        });
        return this;
    }
    moveAllDown(times) {
        this.gridTiles.flat().forEach((cell) => {
            cell.moveDown(times);
        });
        return this;
    }
    moveAllUp(times) {
        this.gridTiles.flat().forEach((cell) => {
            cell.moveUp(times);
        });
        return this;
    }
}