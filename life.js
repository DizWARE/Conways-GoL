function $(selector, container) {
    return (container || document).querySelector(selector);
}

class Life {
    constructor(seed) {
        this.seed = seed;
        this.height = seed.length;
        this.width = seed[0].length;

        this.prevBoard = [];
        this.board = cloneArray(seed);
    }

    next() {
        this.prevBoard = cloneArray(this.board);

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const aliveCount = this.aliveNeighbors(this.prevBoard, x, y);

                switch (aliveCount) {
                    // Two Neighbors, there is no change to its state
                    case 2:
                        break;
                    // Three Neighbors, the cell comes alive if it's dead or just stays alive
                    case 3:
                        this.board[y][x] = 1;
                        break;
                    // Any other scenario puts the cell to death
                    default:
                        this.board[y][x] = 0;
                        break;
                }
            }
        }
    }

    aliveNeighbors(array, x, y) {
        let aliveCount = 0;
        for (let yPrime = y - 1; yPrime < y + 2; yPrime++) {
            if (!array[yPrime]) continue;

            for (let xPrime = x - 1; xPrime < x + 2; xPrime++) {
                if (yPrime === y && xPrime === x) continue;
                aliveCount += +!!array[yPrime][xPrime];
            }
        }
        return aliveCount;
    }

    toString() {
        return this.board.map((row) => row.join(' ')).join('\n');
    }
}

// Helpers
// Warning: Only clones 2D arrays
function cloneArray(array) {
    return array.map((row) => [...row]);
}

class LifeView {
    get boardArray() {
        return this.checkboxes.map((row) => row.map((checkbox) => +checkbox.checked));
    }

    constructor(table, width, height) {
        this.grid = table;
        this.width = width;
        this.height = height;
        this.started = false;
        this.autoplay = true;

        this.createGrid();
    }

    createGrid() {
        const fragment = document.createDocumentFragment();
        this.grid.innerHTML = '';
        this.checkboxes = [];

        for (let row = 0; row < this.height; row++) {
            const rowElement = document.createElement('tr');
            this.checkboxes[row] = [];

            for (let column = 0; column < this.width; column++) {
                const cell = document.createElement('td');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.location = { row, column };
                this.checkboxes[row][column] = checkbox;

                cell.appendChild(checkbox);
                rowElement.appendChild(cell);
            }
            fragment.appendChild(rowElement);
        }

        let isMouseDown = false;
        this.grid.addEventListener('mousedown', () => {
            isMouseDown = true;
        });

        this.grid.addEventListener('mouseup', () => {
            isMouseDown = false;
        });

        this.grid.addEventListener('mouseover', (event) => {
            const checkbox = event.target;

            if (checkbox.nodeName.toLowerCase() === 'input' && isMouseDown) {
                checkbox.checked = true;
                this.started = false;
            }
        });

        this.grid.addEventListener('change', (evt) => {
            if (evt.target.nodeType === 'input') {
                this.started = false;
            }
        });
        this.grid.appendChild(fragment);
    }
    stop() {
        this.started = false;
        clearInterval(this.interval);
    }

    play() {
        this.game = new Life(this.boardArray);
        this.started = true;

        if (this.autoplay) {
            clearInterval(this.interval);
            this.interval = setInterval(() => this.next(), 300);
        }
    }

    next() {
        if (!this.started || !this.game) {
            this.play();
        }

        this.game.next();

        const board = this.game.board;

        for (let row = 0; row < this.height; row++) {
            for (let column = 0; column < this.width; column++) {
                this.checkboxes[row][column].checked = Boolean(board[row][column]);
            }
        }
    }

    clear() {
        for (let row = 0; row < this.height; row++) {
            for (let column = 0; column < this.width; column++) {
                this.checkboxes[row][column].checked = false;
            }
        }

        this.play();
    }
}

const view = new LifeView($(".grid"), 150, 150);

(function () {
    const buttons = {
        next: $('button.next'),
        clear: $('button.clear'),
    };

    buttons.next.addEventListener('click', () => {
        if (view.autoplay) {
            buttons.next.textContent = view.started ? "Start" : "Stop";
        }

        if (view.started && view.autoplay) {
            view.stop();
            return;
        }

        view.next();
    });

    buttons.clear.addEventListener('click', () => {
        view.clear();
    });

    $('input.autoplay').addEventListener('change', function () {
        view.stop();
        buttons.next.textContent = this.checked ? 'Start' : 'Next';
        view.autoplay = this.checked;
    });
})();