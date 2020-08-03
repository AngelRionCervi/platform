import * as _H from "../../../../lib/helpers.js";

export default (gridProps, camera, Cell, sceneBuffer, gameObjectBufferList) => ({
    getAddObjectLoopProps(cursorPos, asset) {
        const blockSize = gridProps.getBlockSize();
        const gridTiles = gridProps.getTiles(); // no cellToRender because 1 sprite can be > viewport
        const tw = camera.toWorld.bind(camera);
        const ts = camera.toScreen.bind(camera);
        const camCoords = camera.getCoords();
        const zoom = camera.getZoom();

        const adjWidth = _H.roundToNearestMult(asset.width, blockSize);
        const adjHeight = _H.roundToNearestMult(asset.height, blockSize);
        const sampleWidth = adjWidth / blockSize;
        const sampleHeight = adjHeight / blockSize;

        const maxX = tw(cursorPos.x + ts(adjWidth)) - camCoords.x;
        const restX = _H.posOr0(-(gridProps.getWidth() - maxX));
        const maxY = tw(cursorPos.y + ts(adjHeight)) - camCoords.y;
        const restY = _H.posOr0(-(gridProps.getHeight() - maxY));

        const floorCursor = this.floorMouse(cursorPos);
        const cell = this.getCellByCursor(cursorPos);

        return {
            blockSize,
            gridTiles,
            tw,
            ts,
            camCoords,
            maxX,
            restX,
            maxY,
            restY,
            floorCursor,
            sampleWidth,
            sampleHeight,
            cell,
            zoom,
        };
    },

    setSceneObject(cellOrCursor, asset, addSceneObjectToList, removeSceneObjectOfList, slice = null) {
        const gridTiles = gridProps.getTiles();
        const blockSize = gridProps.getBlockSize();
        const clickedCell = cellOrCursor instanceof Cell ? cellOrCursor : this.getCellByCursor(cellOrCursor);

        sceneBuffer.update({ x: clickedCell.x, y: clickedCell.y }, asset, slice);

        for (let x = clickedCell.absX; x < asset.trueWidth / blockSize + clickedCell.absX; x++) {
            const sliceX = x * blockSize;
            for (let y = clickedCell.absY; y < asset.trueHeight / blockSize + clickedCell.absY; y++) {
                if (!gridTiles?.[x]?.[y]) continue; // à optimiser
                const sliceY = y * blockSize;
                const slice = {
                    x: sliceX,
                    y: sliceY,
                    absX: sliceX - clickedCell.x,
                    absY: sliceY - clickedCell.y,
                };
                const cell = gridTiles[x][y];
                if (cell.isProp()) {
                    removeSceneObjectOfList(cell.getProp().getID());
                }
                cell.setProp(addSceneObjectToList({ x: sliceX, y: sliceY }, asset, slice));
            }
        }
        return this;
    },

    setSceneObjectOnUniqCell(cellOrCursor, asset, addSceneObjectToList, removeSceneObjectOfList, slice = null) {
        const clickedCell = cellOrCursor instanceof Cell ? cellOrCursor : this.getCellByCursor(cellOrCursor);
        if (clickedCell.isProp()) {
            removeSceneObjectOfList(clickedCell.getProp().getID());
        }
        sceneBuffer.update({ x: clickedCell.x, y: clickedCell.y }, asset, slice);
        clickedCell.setProp(addSceneObjectToList({ x: clickedCell.x, y: clickedCell.y }, asset));
        return this;
    },

    setGameObject(cursorPos, objectID, addGameObjectToList) {
        const prop = addGameObjectToList(cursorPos, objectID);
        if (!prop) return;

        const coord = this.floorMouseNoBlock(cursorPos);
        gameObjectBufferList.add(prop, coord);
        return this;
    },

    floodFill(cursorPos, asset, addSceneObjectToList, removeSceneObjectOfList) {
        // 2 freaking days
        const targetCell = this.getCellByCursor(cursorPos);
        const tiles = gridProps.getTiles();
        const blockSize = gridProps.getBlockSize();
        const targetAsset = targetCell.isProp() ? targetCell.getProp().asset.name : null;
        if (targetAsset !== asset.name) {
            const cellsToCheck = [
                {
                    tile: targetCell,
                    slice: { sx: 0, sy: 0, x: targetCell.absX * blockSize, y: targetCell.absY * blockSize },
                },
            ];
            while (cellsToCheck.length > 0) {
                const lastObj = cellsToCheck.shift();
                const lastCell = lastObj.tile;
                const oldSlice = lastObj.slice;
                const lastCellProp = lastCell.isProp() ? lastCell.getProp().asset.name : null;

                if (targetAsset === lastCellProp) {
                    this.setSceneObjectOnUniqCell(
                        lastCell,
                        asset,
                        addSceneObjectToList,
                        removeSceneObjectOfList,
                        oldSlice
                    );

                    if (tiles[lastCell.absX + 1]) {
                        let sx = oldSlice.sx + blockSize;
                        if (sx >= asset.trueWidth) sx = 0;
                        const newSlice = {
                            sx,
                            sy: oldSlice.sy,
                            x: oldSlice.x + blockSize,
                            y: oldSlice.y,
                        };
                        cellsToCheck.push({ tile: tiles[lastCell.absX + 1][lastCell.absY], slice: newSlice });
                    }
                    if (tiles[lastCell.absX - 1]) {
                        let sx = oldSlice.sx - blockSize;
                        if (sx <= 0) sx = asset.trueWidth - blockSize;
                        const newSlice = {
                            sx,
                            sy: oldSlice.sy,
                            x: oldSlice.x - blockSize,
                            y: oldSlice.y,
                        };
                        cellsToCheck.push({ tile: tiles[lastCell.absX - 1][lastCell.absY], slice: newSlice });
                    }
                    if (tiles[lastCell.absX][lastCell.absY + 1]) {
                        let sy = oldSlice.sy + blockSize;
                        if (sy >= asset.trueHeight) sy = 0;
                        const newSlice = {
                            sx: oldSlice.sx,
                            sy,
                            x: oldSlice.x,
                            y: oldSlice.y + blockSize,
                        };
                        cellsToCheck.push({ tile: tiles[lastCell.absX][lastCell.absY + 1], slice: newSlice });
                    }
                    if (tiles[lastCell.absX][lastCell.absY - 1]) {
                        let sy = oldSlice.sy - blockSize;
                        if (sy <= 0) sy = asset.trueHeight - blockSize;
                        const newSlice = {
                            sx: oldSlice.sx,
                            sy,
                            x: oldSlice.x,
                            y: oldSlice.y - blockSize,
                        };
                        cellsToCheck.push({ tile: tiles[lastCell.absX][lastCell.absY - 1], slice: newSlice });
                    }
                }
            }
        }
    },

    removeCellByCoord(cursorPos) {
        const cell = this.getCellByCursor(cursorPos);
        sceneBuffer.clearTile({ x: cell.x, y: cell.y }, gridProps.getBlockSize());
        cell.removeProp();
    },

    removeCellByID(id) {
        const cell = this.getCellByID(id);
        if (!cell) return;
        cell.clearBufferCell(true);
    },

    removeGameObject(buffer) {
        gameObjectBufferList.remove(buffer.id);
    },
});
