import { Cell } from "./Cell.js";
import { GridNormalization } from "./GridNormalization.js";
import * as _H from "../../../lib/helpers.js";
import { _G } from "../../general/globals.js";
import {
    getCanvas,
    getContext,
    sceneContainer,
    collisionContainer,
    entityContainer,
    selectionContainer,
    setCanvasSize,
} from "../../general/canvasRef.js";
import gridProps from "./GridProps.js";
import camera from "../../camera/Camera.js";
import { sceneBuffer, gameObjectBufferList } from "../../general/CanvasBuffer.js";
import entitySelection from "../../general/entitySelection.js";
import HelperGrid from "./HelperGrid.js";
import CollisionBox from "../collision/CollisionBox.js";
import { render } from "./traits/renderer.js";
import sizeTraits from "./traits/size.js";
import entityDragTraits from "./traits/entityDrag.js";
import collisionTraits from "./traits/collision.js";
import drawingTraits from "./traits/drawing.js";

const helperGrid = new HelperGrid();
const collisionBox = new CollisionBox();
const gridNormal = new GridNormalization();

const canvas = getCanvas();
const ctx = getContext();

_H.spy(camera, "setScale", [, /*() => helperGrid.build()*/ () => renderGrid(true)]); // spy for the methods calls of either "increaseZoom" or "decreaseZoom" in camera and exec cb

export class Grid {
    constructor() {
        this.colliderW = 3;
        this.cellFillStyle = "black";
        this.dragging = false;
        this.startDragCoord = null;
        this.objDragOrigins = null;
        Object.assign(this, {...sizeTraits(gridProps, Cell, () => renderGrid(true))});
        Object.assign(this, {...entityDragTraits(gameObjectBufferList, camera)});
        Object.assign(this, {...collisionTraits(collisionBox)});
        Object.assign(this, {...drawingTraits(gridProps, camera, Cell, sceneBuffer, gameObjectBufferList)})
    }

    init() {
        setCanvasSize(_G.viewPortWidth, _G.viewPortHeight);
        const blockSize = gridProps.getBlockSize();
        const width = gridProps.getWidth();
        const height = gridProps.getHeight();
        let tileCollection = new Array(Math.round(width / blockSize));

        for (let u = 0; u < tileCollection.length; u++) {
            tileCollection[u] = new Array(Math.round(height / blockSize));
        }

        for (let x = 0; x < width / blockSize; x++) {
            for (let y = 0; y < height / blockSize; y++) {
                const id = _H.uniqid();
                const cellObj = new Cell(id, x * blockSize, y * blockSize, x, y, "air", null);
                tileCollection[x][y] = cellObj;
            }
        }
        gridProps.setTiles(tileCollection);
        camera.setCellsToInteract(gridProps.getTiles());
        helperGrid.build();
    }

    floorMouse(coords) {
        const blockSize = gridProps.getBlockSize();
        const tw = camera.toWorld.bind(camera);
        const x = _H.roundToPrevMult(tw(coords.x - camera.x, "noRound"), blockSize);
        const y = _H.roundToPrevMult(tw(coords.y - camera.y, "noRound"), blockSize);
        return { x, y };
    }

    floorMouseNoBlock(coords) {
        const tw = camera.toWorld.bind(camera);
        const x = tw(coords.x - camera.x);
        const y = tw(coords.y - camera.y);
        return { x, y };
    }

    getCellByCursor(cursorPos, coords = null) {
        const { x, y } = this.floorMouse(cursorPos);
        if (coords) {
            return coords.find((n) => n.x === x && n.y === y);
        }
        const flatCoord = gridProps.getRenderedCells().flat();
        const targetCell = flatCoord.find((n) => n.x === x && n.y === y);
        return targetCell;
    }

    getCellByID(id) {
        return gridProps
            .getTiles()
            .flat()
            .find((el) => el.id === id);
    }

    getMap() {
        const nMap = gridNormal.normalize(gridCoords, this.blockSize, canvas);
        const debugBlocks = this.debugBlocks(nMap);

        return {
            width: gridProps.getWidth(),
            height: gridProps.getHeight(),
            coords: nMap,
            debugColliders: debugBlocks,
        };
    }

    debugBlocks(nMap) {
        console.log("nMap", nMap);

        const colliders = [];

        nMap.forEach((v) => {
            colliders.push([
                { type: "yWall", x: v.x + this.colliderW, y: v.y, w: v.w - this.colliderW, h: this.colliderW }, //top
                {
                    type: "yWall",
                    x: v.x + this.colliderW,
                    y: v.y + v.h - this.colliderW,
                    w: v.w - this.colliderW,
                    h: this.colliderW,
                }, //bottom
                { type: "xWall", x: v.x, y: v.y, w: this.colliderW, h: v.h }, //left
                { type: "xWall", x: v.x + v.w - this.colliderW, y: v.y, w: this.colliderW, h: v.h },
            ]); //right
        });

        return colliders;
    }
}

function createMapBorder() {
    // visual
    const cameraCoords = camera.getCoords();
    const { vpWidth, vpHeight } = camera.getViewPort();
    const gridWidth = gridProps.getWidth();
    const gridHeight = gridProps.getHeight();
    const borderWidth = _G.mapBorderWidth;
    const ts = camera.toScreen.bind(camera);
    const tw = camera.toWorld.bind(camera);

    ctx.fillStyle = _G.mapBordersColor;
    if (cameraCoords.x >= 0) {
        // left
        ctx.fillRect(
            ts(cameraCoords.x - borderWidth),
            ts(cameraCoords.y - borderWidth),
            borderWidth,
            ts(gridHeight + borderWidth) + borderWidth
        );
    }
    if (-cameraCoords.x + tw(vpWidth) >= gridWidth) {
        //right
        ctx.fillRect(
            ts(cameraCoords.x + gridWidth),
            ts(cameraCoords.y - borderWidth),
            borderWidth,
            ts(gridHeight + borderWidth) + borderWidth
        );
    }
    if (cameraCoords.y >= 0) {
        // top
        ctx.fillRect(
            ts(cameraCoords.x - borderWidth),
            ts(cameraCoords.y - borderWidth),
            ts(gridWidth + borderWidth) + borderWidth,
            borderWidth
        );
    }
    if (-cameraCoords.y + tw(vpHeight) >= gridHeight) {
        // bottom
        ctx.fillRect(
            ts(cameraCoords.x - borderWidth),
            ts(cameraCoords.y + gridHeight),
            ts(gridWidth + borderWidth) + borderWidth,
            borderWidth
        );
    }
}

export function renderGrid(zoomed = false) {
    render(zoomed, camera, gameObjectBufferList, gridProps, helperGrid, entitySelection, [
        sceneContainer,
        entityContainer,
        collisionContainer,
        selectionContainer,
    ]);
}

export function fillAllCells(cellsToRender) {
    cellsToRender.forEach((cellObj) => {
        if (cellObj.isProp()) {
            cellObj.fillCell();
        }
    });
}

function debugCell(x, y) {
    setTimeout(() => {
        ctx.fillStyle = "red";
        const ts = camera.toScreen.bind(camera);
        const blockSize = gridProps.getBlockSize();
        ctx.fillRect(ts(x), ts(y), ts(blockSize), ts(blockSize));
    }, 0);
}

function debugRenderedCells(cells) {
    // gap closing between cells
    const zoom = camera.getZoom();
    const bs = gridProps.getBlockSize();
    const trueBS = Math.floor(bs * zoom);
    let lastX;
    let col = -1;
    const newGrid = [];
    for (const cell of cells) {
        if (cell.x !== lastX) {
            lastX = cell.x;
            newGrid.push([]);
            col++;
        }
        newGrid[col].push(cell);
    }
    newGrid.forEach((col, colIndex, grid) => {
        if (colIndex > 0) {
            col.map((cell) => {
                cell.addedBlockW = Math.abs(grid[colIndex][0].tx - grid[colIndex - 1][0].tx) - trueBS;
            });
        }
        col.forEach((cell, cellY, colArr) => {
            if (cellY > 0) {
                cell.addedBlockH = Math.abs(colArr[cellY].ty - colArr[cellY - 1].ty) - trueBS;
            }
        });
    });
    return newGrid.flat();
}
