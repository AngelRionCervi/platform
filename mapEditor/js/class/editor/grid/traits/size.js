import * as _H from "../../../../lib/helpers.js";

export default (gridProps, Cell, cb) => ({
    addCol(side) {
        const blockSize = gridProps.getBlockSize();
        gridProps.setWidth(gridProps.getWidth() + blockSize);
        const newCol = [];

        if (side === "right") {
            for (let y = 0; y < gridProps.getHeight() / blockSize; y++) {
                const id = _H.uniqid();
                const cellObj = new Cell(
                    id,
                    gridProps.getWidth() - blockSize,
                    y * blockSize,
                    gridProps.getWidth() / blockSize - 1,
                    y,
                    "air",
                    null
                );
                newCol.push(cellObj);
            }

            gridProps.newColRight(newCol);
        } else if (side === "left") {
            for (let y = 0; y < gridProps.getHeight() / blockSize; y++) {
                const id = _H.uniqid();
                const cellObj = new Cell(id, 0, y * blockSize, 0, y, "air", null);
                newCol.push(cellObj);
            }

            gridProps.moveAllRight(1).newColLeft(newCol);
            camera.moveRight(blockSize);
        }
    },

    addRow(side) {
        const blockSize = gridProps.getBlockSize();
        gridProps.setHeight(gridProps.getHeight() + blockSize);
        const newRow = [];

        if (side === "bottom") {
            for (let x = 0; x < gridProps.getWidth() / blockSize; x++) {
                const id = _H.uniqid();
                const cellObj = new Cell(
                    id,
                    x * blockSize,
                    gridProps.getHeight() - blockSize,
                    x,
                    gridProps.getHeight() / blockSize - 1,
                    "air",
                    null
                );
                newRow.push(cellObj);
            }
            gridProps.newRowBottom(newRow);
        } else if (side === "top") {
            for (let x = 0; x < gridProps.getWidth() / blockSize; x++) {
                const id = _H.uniqid();
                const cellObj = new Cell(id, x * blockSize, 0, x, 0, "air", null);
                newRow.push(cellObj);
            }
            gridProps.moveAllDown(1).newRowTop(newRow);
            camera.moveBottom(blockSize);
        }
    },

    removeCol(side) {
        const blockSize = gridProps.getBlockSize();
        gridProps.setWidth(gridProps.getWidth() - blockSize);
        if (side === "right") {
            gridProps.removeColRight();
        } else if (side === "left") {
            gridProps.removeColLeft().moveAllLeft(1);
            camera.moveLeft(blockSize);
        }
    },

    removeRow(side) {
        const blockSize = gridProps.getBlockSize();
        gridProps.setHeight(gridProps.getHeight() - blockSize);
        if (side === "bottom") {
            gridProps.removeRowBottom();
        } else if (side === "top") {
            gridProps.removeRowTop().moveAllUp(1);
            camera.moveTop(blockSize);
        }
    },

    resizeGrid({ width, height }) {
        const curWidth = gridProps.getAbsWidth();
        const curHeight = gridProps.getAbsHeight();

        const wInc = width - curWidth;
        const hInc = height - curHeight;

        for (let u = 0; u < Math.abs(wInc); u++) {
            wInc < 0 ? this.removeCol("right") : this.addCol("right");
        }
        for (let u = 0; u < Math.abs(hInc); u++) {
            hInc < 0 ? this.removeRow("bottom") : this.addRow("bottom");
        }
        console.log(cb)
        cb();
    }
})