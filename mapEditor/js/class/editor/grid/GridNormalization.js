export class GridNormalization {
    constructor() {
        
    }

    normalize(gridCoords, blockS, canv) { // this couldn't get worse rly;

        const blockSize = blockS;
        const canvas = canv;

        let yGrid = gridCoords;
        let xGrid = [];

        let xRows = [];

        let sortedX = [];
        let sortedXY = [];

        let doneL = [];
        let doneX = [];

        let stacked = [];
        let yCount = 0;
        let id = 0;

        // "invert" yGrid to make a grid based on X;
        for (let u = 0; u < yGrid[0].length; u++) {
            xGrid.push([]);
        }

        for (let n = 0; n < yGrid.length; n++) {
            for (let u = 0; u < yGrid[n].length; u++) {
                xGrid[u].push(yGrid[n][u]);
            }
        }

        // identify if there is a block and make rows of X blocks;
        for (let u = 0; u < xGrid.length; u++) {
            let fGrid = xGrid[u].filter(n => n.blockType !== "air");
            let rowLength = 0;

            if (fGrid.length > 0) {
                for (let k = 0; k < fGrid.length; k++) {

                    let next;
                    if (k < fGrid.length - 1) {
                        next = fGrid[k + 1].x;
                    }
                    rowLength++;

                    if (Math.abs(next - fGrid[k].x) !== blockSize) {
                        let x = fGrid[k - rowLength + 1].x;
                        let y = fGrid[k - rowLength + 1].y;

                        if (rowLength > 0) {
                            let blockObj = { id: id, y: y, x: x, l: rowLength * blockSize };
                            xRows.push(blockObj);
                        }
                        rowLength = 0;
                        id++;
                    }
                }
            }
        }

        //makes unique arrays of x and l rows;
        for (let i = 0; i < xRows.length; i++) {
            if (!doneL.includes(xRows[i].l) || !doneX.includes(xRows[i].x)) {
                doneL.push(xRows[i].l);
                doneX.push(xRows[i].x);
            }
        }

        for (let i = 0; i < doneX.length; i++) {
            for (let j = 0; j < doneL.length; j++) {

                let row = xRows.filter(el => el.x === doneX[i] && el.l === doneL[j]);

                if (row.length > 0) {
                    sortedX.push(row);
                }
            }
        }

        // filter the rows by Y gaps;
        for (let i = 0; i < sortedX.length; i++) {

            let subArrLen = sortedX[i].length;

            for (let j = sortedX[i].length - 1; j > 0; j--) {
                if (Math.abs(sortedX[i][j].y - sortedX[i][j - 1].y) !== blockSize) {

                    sortedXY.unshift(sortedX[i].slice(j, subArrLen));
                    subArrLen = j;
                }
                if (j === 1) {
                    sortedXY.unshift(sortedX[i].slice(j - 1, subArrLen));
                }
            }

            if (subArrLen === 1) {
                sortedXY.push([sortedX[i][0]]);
            }
        }

        // assemble the blocks;
        for (let i = 0; i < sortedXY.length; i++) {
            for (let j = 0; j < sortedXY[i].length; j++) {
                yCount++;

                if (j === sortedXY[i].length - 1) {
                    let block = { x: sortedXY[i][0].x, y: sortedXY[i][0].y, w: sortedXY[i][0].l, h: yCount * blockSize };
                    stacked.push(block);
                    yCount = 0;
                }
            }
        }

        // adds map limits;
        stacked.push(
            { x: 0, y: 0, w: 1, h: canvas.width }, //bottom
            { x: 0, y: canvas.height, w: canvas.width, h: 1 }, //top
            { x: 0, y: 0, w: canvas.width, h: 1 }, //right
            { x: canvas.width, y: 0, w: 1, h: canvas.height } //left
        )

        // removes duplicates because the algo sucks;
        const uniq = Array.from(new Set(stacked.map(JSON.stringify))).map(JSON.parse);

        return uniq;
    }
}