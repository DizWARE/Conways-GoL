

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

        for (let column = 0; column < this.height; column++) {
            for (let row = 0; row < this.width; row++) {
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
        for (let columnPrime = cellRow - 1; columnPrime < cellRow + 2; columnPrime++) {
            for (let rowPrime = cellColumn - 1; rowPrime < cellColumn + 2; rowPrime++) {
                if (columnPrime === cellRow && rowPrime === cellColumn) continue;

                const row = columnPrime < 0 ? this.height - 1 : columnPrime >= this.height ? 0 : columnPrime;
                const column = rowPrime < 0 ? this.width - 1 : rowPrime >= this.width ? 0 : rowPrime

                aliveCount += +!!array[row][column];
            }
        }
        return aliveCount;
    }

    reset() {
        this.grid = cloneArray(this.startingGrid);
    }
}
