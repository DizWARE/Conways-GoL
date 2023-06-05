

class Life {
    constructor(startingGrid, debug = false) {
        this.startingGrid = startingGrid;
        this.height = startingGrid.length;
        this.width = startingGrid[0].length;

        this.prevGrid = [];
        this.grid = cloneArray(startingGrid);
        this._next = this.next;

        this.debug = debug;
    }

    aliveNeighbors(grid, cellRow, cellColumn) {
        let aliveCount = 0;

        for (let neighborRow = cellRow - 1; neighborRow < cellRow + 2; neighborRow++) {
            for (let neighborColumn = cellColumn - 1; neighborColumn < cellColumn + 2; neighborColumn++) {
                // Skip the location of our cell.
                if (neighborRow === cellRow && neighborColumn === cellColumn) continue;

                // Is there a way that we can make the edges wrap(see demonstaration)

                let rowToUse = neighborRow < 0 ? this.width - 1 : neighborRow >= this.width ? 0 : neighborRow;
                let columnToUse = neighborColumn < 0 ? this.height - 1 : neighborColumn >= this.height ? 0 : neighborColumn;

                const neighborToCheck = grid[rowToUse][columnToUse];
                aliveCount += neighborToCheck;
            }
        }
        return aliveCount;
    }

    next() {
        this.prevGrid = cloneArray(this.grid);

        for (let row = 0; row < this.height; row++) {
            for (let column = 0; column < this.width; column++) {
                const aliveCount = this.aliveNeighbors(this.prevGrid, row, column);

                // RULES OF GAME OF LIFE
                // 1) A single cell will become alive if 3 neigbors are alive
                // 2) A single cell will die if less than 2 neighbors or more than 3 neighbors are alive

                // Using what we know lets program what changes to the cell at column and row need to be.
                switch (aliveCount) {
                    case 3:
                        this.grid[row][column] = 1;
                        break;
                    case 2:
                        break;
                    default:
                        this.grid[row][column] = 0;
                        break;
                }
            }
        }
    }

    reset() {
        this.grid = cloneArray(this.startingGrid);
    }

    /** IGNORE EVERYTHING BELOW HERE. This allows us to print a representation of the grid to the console if enabled */
    set debug(debug) {
        this.toggleDebugLogs(debug);
    }

    toggleDebugLogs(debug) {
        if (debug) {
            const next = this.next.bind(this);
            this.next = () => {
                console.log(`Before next step update:\n${this.toString()}`);
                next();
                console.log(`After next step update:\n${this.toString()}`);
            }
        } else {
            this.next = this._next.bind(this);
        }
    }

    toString() {
        return this.grid.map((row) => row.join(" ")).join("\n");
    }
}
