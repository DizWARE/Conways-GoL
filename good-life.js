

class Life {
    constructor(startingGrid) {
        this.startingGrid = startingGrid;
        this.height = startingGrid.length;
        this.width = startingGrid[0].length;

        this.prevGrid = [];
        this.grid = cloneArray(startingGrid);
    }

    next() {
        this.prevGrid = cloneArray(this.grid);

        for (let row = 0; row < this.height; row++) {
            for (let column = 0; column < this.width; column++) {
                const aliveCount = this.aliveNeighbors(this.prevGrid, column, row);

                switch (aliveCount) {
                    // Two Neighbors, there is no change to its state
                    case 2:
                        break;
                    // Three Neighbors, the cell comes alive if it's dead or just stays alive
                    case 3:
                        this.grid[row][column] = 1;
                        break;
                    // Any other scenario puts the cell to death
                    default:
                        this.grid[row][column] = 0;
                        break;
                }
            }
        }
    }

    aliveNeighbors(array, cellColumn, cellRow) {
        let aliveCount = 0;
        for (let rowPrime = cellRow - 1; rowPrime < cellRow + 2; rowPrime++) {
            for (let columnPrime = cellColumn - 1; columnPrime < cellColumn + 2; columnPrime++) {
                if (rowPrime === cellRow && columnPrime === cellColumn) continue;

                const row = rowPrime < 0 ? this.height - 1 : rowPrime >= this.height ? 0 : rowPrime;
                const column = columnPrime < 0 ? this.width - 1 : columnPrime >= this.width ? 0 : columnPrime

                aliveCount += +!!array[row][column];
            }
        }
        return aliveCount;
    }

    reset() {
        this.grid = cloneArray(this.startingGrid);
    }
}
