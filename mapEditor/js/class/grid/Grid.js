export class Grid {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.gridWidth = 1280;
        this.gridHeight = 768;
        this.blockSize = 64;
        this.gridCoords;
        this.lineWidth = 1;
        this.colliderW = 3;
        this.cellFillStyle = "black";

        this.roundToPrevMult = (n) => Math.ceil((n - this.blockSize) / this.blockSize) * this.blockSize;
    }

    create(prevCoords = []) {

        this.gridCoords = new Array(this.gridWidth / this.blockSize);

        for (let u = 0; u < this.gridCoords.length; u++) {
            this.gridCoords[u] = new Array(this.gridHeight / this.blockSize);
        }

        this.canvas.width = this.gridWidth;
        this.canvas.height = this.gridHeight;

        let idStart = 0;

        for (let x = 0; x < this.gridWidth; x += this.blockSize) {
            for (let y = 0; y < this.gridHeight; y += this.blockSize) {

                this.ctx.lineWidth = this.lineWidth;

                this.ctx.moveTo(this.lineWidth / 2 + x, this.lineWidth / 2 + y);
                this.ctx.lineTo(this.lineWidth / 2 + x + this.blockSize, this.lineWidth / 2 + y);
                this.ctx.lineTo(this.lineWidth / 2 + x + this.blockSize, this.lineWidth / 2 + y + this.blockSize);
                this.ctx.strokeStyle = "black";
                this.ctx.stroke();

                let cellObj;

                cellObj = { id: (x + y) / this.blockSize + idStart, x: x, y: y, block: false };

                if (prevCoords[x / this.blockSize] && prevCoords[x / this.blockSize][y / this.blockSize]) {
                    let prevCoord = prevCoords[x / this.blockSize][y / this.blockSize];
                    prevCoord.id = (x + y) / this.blockSize + idStart;
                    cellObj = prevCoord;
                }

                this.gridCoords[x / this.blockSize][y / this.blockSize] = cellObj;

                if (cellObj.block) {
                    this.fillCell(x, y);
                }
            }

            let minSide = Math.min(this.gridWidth, this.gridHeight)
            idStart += minSide / this.blockSize - 1;
        }
    }

    getCellByCursor(cursorPos) {
        let roundX = this.roundToPrevMult(cursorPos.x);
        let roundY = this.roundToPrevMult(cursorPos.y);

        let flatCoord = this.gridCoords.flat();

        let targetCell = flatCoord.find(n => n.x === roundX && n.y === roundY);
        return { cell: targetCell, x: roundX, y: roundY };
    }

    fillCellByCursor(cursorPos) {
        let obj = this.getCellByCursor(cursorPos);
        
        obj.cell.block = true;

        this.fillCell(obj.x, obj.y);
    }

    removeCellByCursor(cursorPos) {
        let obj = this.getCellByCursor(cursorPos);
        
        obj.cell.block = false;
        this.create(this.gridCoords);
    }

    fillCell(x, y) {
        this.ctx.beginPath();
        this.ctx.rect(x + 1, y + 1, this.blockSize - 1, this.blockSize - 1);
        this.ctx.fillStyle = this.cellFillStyle;
        this.ctx.fill();
        this.ctx.closePath();
    }

    addCol() {
        const prevCoords = JSON.parse(JSON.stringify(this.gridCoords));
        this.gridWidth += this.blockSize;
        this.create(prevCoords);
    }

    addRow() {
        const prevCoords = JSON.parse(JSON.stringify(this.gridCoords));
        this.gridHeight += this.blockSize;
        this.create(prevCoords);
    }

    getMap() {
        const nMap = this.normalize();
        const debugBlocks = this.debugBlocks(nMap);

        return { width: this.gridWidth, height: this.gridHeight, coords: nMap, debugColliders: debugBlocks };
    }

    normalize() { // this couldn't get worse rly;
        let yGrid = this.gridCoords;
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

            let fGrid = xGrid[u].filter(n => n.block === true);
            let rowLength = 0;

            if (fGrid.length > 0) {
                for (let k = 0; k < fGrid.length; k++) {

                    let next;
                    if (k < fGrid.length - 1) {
                        next = fGrid[k + 1].x;
                    }
                    rowLength++;

                    if (Math.abs(next - fGrid[k].x) !== this.blockSize) {
                        let x = fGrid[k - rowLength + 1].x;
                        let y = fGrid[k - rowLength + 1].y;

                        if (rowLength > 0) {
                            let blockObj = { id: id, y: y, x: x, l: rowLength * this.blockSize };
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
                if (Math.abs(sortedX[i][j].y - sortedX[i][j - 1].y) !== this.blockSize) {

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
                    let block = { x: sortedXY[i][0].x, y: sortedXY[i][0].y, w: sortedXY[i][0].l, h: yCount * this.blockSize };
                    stacked.push(block);
                    yCount = 0;
                }
            }
        }

        // adds map limits;
        stacked.push(
            { x: 0, y: 0, w: 1, h: this.canvas.width }, //bottom
            { x: 0, y: this.canvas.height, w: this.canvas.width, h: 1 }, //top
            { x: 0, y: 0, w: this.canvas.width, h: 1 }, //right
            { x: this.canvas.width, y: 0, w: 1, h: this.canvas.height } //left
        )

        // removes duplicate because the algo sucks;
        const uniq = new Set(stacked.map(e => JSON.stringify(e)));
        const res = Array.from(uniq).map(e => JSON.parse(e));

        return res;
    }

    debugBlocks(nMap) {
        console.log('nMap', nMap)

        let colliders = [];
        /*
        nMap.forEach((v) => {
            colliders.push([{ type: 'yWall', x: v.x + this.colliderW, y: v.y, w: v.w - this.colliderW, h: this.colliderW }, //top
                { type: 'yWall', x: v.x + this.colliderW, y: v.y + v.h - this.colliderW, w: v.w - this.colliderW, h: this.colliderW }, //bottom
                { type: 'xWall', x: v.x, y: v.y, w: this.colliderW, h: v.h }, //left
                { type: 'xWall', x: v.x + v.w - this.colliderW, y: v.y, w: this.colliderW, h: v.h }]); //right
        })*/

        return colliders;
    }
}