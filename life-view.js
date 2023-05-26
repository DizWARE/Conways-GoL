class LifeView {
    get debug() {
        return this._debug;
    }

    set debug(debug) {
        this._debug = debug;

        if (this.game) {
            this.game.debug = debug;
        }
    }

    get gridArray() {
        return this.checkboxes.map((row) => row.map((checkbox) => Number(checkbox.checked)));
    }

    constructor(grid, width, height) {
        this.autoplay = true;
        this.checkboxes = [];
        this.height = height;
        this.iterationSpeed = 300;
        this.iterationLabel = $("span.iteration-count");
        this.grid = grid;
        this.mouseDownState = null;
        this.previousStartingState = [];
        this.width = width;
        this._debug = false;

        this.createGrid();
    }

    clear() {
        for (let row = 0; row < this.height; row++) {
            for (let column = 0; column < this.width; column++) {
                this.checkboxes[row][column].checked = false;
            }
        }

        this.updateIteration(true);

        if (this.game) {
            this.play();
        }
    }


    createGrid() {
        const fragment = document.createDocumentFragment();
        this.grid.innerHTML = "";

        for (let row = 0; row < this.height; row++) {
            const rowElement = this.createGridRow(row);
            fragment.appendChild(rowElement);
        }

        this.grid.addEventListener("mousedown", this.handleMouseDown);
        this.grid.addEventListener("mouseup", this.handleMouseUp);
        this.grid.addEventListener("mouseover", this.handleMouseOver);

        this.grid.addEventListener("touchstart", this.handleTouchStart);
        this.grid.addEventListener("touchend", this.handleTouchEnd);
        this.grid.addEventListener("touchmove", this.handleTouchMove);
        this.grid.addEventListener("click", this.disableClick)

        this.grid.appendChild(fragment);
    }

    createGridRow(row) {
        const rowElement = document.createElement("div");
        rowElement.className = "row";
        this.checkboxes[row] = [];

        for (let column = 0; column < this.width; column++) {
            const cell = this.createGridSquare(row, column);
            rowElement.appendChild(cell);
        }

        return rowElement;
    }

    createGridSquare(row, column) {
        const cell = document.createElement("div");
        const checkbox = document.createElement("input");

        cell.className = "cell";
        checkbox.type = "checkbox";

        checkbox.setAttribute("data-location-row", row);
        checkbox.setAttribute("data-location-column", column);

        this.checkboxes[row][column] = checkbox;

        cell.appendChild(checkbox);

        return cell;
    }

    disableClick = (event) => {
        event.stopPropagation();
        event.preventDefault();
    }

    dispose() {
        this.stop();
        this.reset();
        this.grid.removeEventListener("mousedown", this.handleMouseDown);
        this.grid.removeEventListener("mouseup", this.handleMouseUp);
        this.grid.removeEventListener("mouseover", this.handleMouseOver);
        this.grid.removeEventListener("click", this.disableClick);

        this.grid.removeEventListener("touchstart", this.handleTouchStart);
        this.grid.removeEventListener("touchend", this.handleTouchEnd);
        this.grid.removeEventListener("touchmove", this.handleTouchMove);
        this.grid.removeEventListener("click", this.disableClick)

        this.grid.innerHTML = "";
    }


    handleMouseDown = (event) => {
        const checkbox = event.target;

        if (checkbox.nodeName.toLowerCase() === "input") {
            this.game = null;

            const row = checkbox.getAttribute("data-location-row");
            const column = checkbox.getAttribute("data-location-column");

            this.mouseDownState = !this.checkboxes[row][column].checked;
            this.handleMouseOver(event);
        }
    }

    handleMouseUp = () => {
        this.mouseDownState = null;
    }

    handleMouseOver = (event) => {
        const checkbox = event.target;

        if (checkbox.nodeName.toLowerCase() === "input" && this.mouseDownState !== null) {
            const row = checkbox.getAttribute("data-location-row");
            const column = checkbox.getAttribute("data-location-column");
            this.checkboxes[row][column].checked = event.ctrlKey ^ this.mouseDownState;
        }
    }

    handleTouchStart = (event) => {
        this.disableClick(event);

        const touch = event.changedTouches[0];
        const target = touch.target;

        if (target.nodeName.toLowerCase() === "input") {
            this.game = null;

            const row = target.getAttribute("data-location-row");
            const column = target.getAttribute("data-location-column");

            this.mouseDownState = !this.checkboxes[row][column].checked;
            this.handleTouchMove(event);
        }
    }

    handleTouchEnd = (event) => {
        if (event.touches.length === 0) {
            this.disableClick(event);
            this.mouseDownState = null;
        }
    }

    handleTouchMove = (event) => {
        const touch = event.changedTouches[0];
        const target = document.elementFromPoint(touch.clientX, touch.clientY)

        if (target.nodeName.toLowerCase() === "input" && this.mouseDownState !== null) {
            const row = target.getAttribute("data-location-row");
            const column = target.getAttribute("data-location-column");
            this.checkboxes[row][column].checked = this.isMultiTouch(event.touches) ^ this.mouseDownState;
        }
    }

    isMultiTouch(touches) {
        return touches.length > 1;
    }

    next() {
        if (this.mouseDownState !== null) {
            // If mouse is down, pause the game; This way we don't outpace the user interaction
            return;
        }

        if (!this.game) {
            this.play();
        }

        this.game.next();

        this.updateIteration();

        for (let row = 0; row < this.height; row++) {
            for (let column = 0; column < this.width; column++) {
                this.checkboxes[row][column].checked = Boolean(this.game.grid[row][column]);
            }
        }
    }

    play() {
        this.stop();
        this.game = new Life(this.gridArray, this.debug);
        this.previousStartingState = this.game.startingGrid;

        if (this.autoplay) {
            this.interval = setInterval(() => this.next(), this.iterationSpeed);
        }
    }

    reset() {
        if (!this.previousStartingState) {
            return;
        }

        const resetState = this.previousStartingState;

        this.updateIteration(true);

        if (this.game) {
            this.game.grid = cloneArray(resetState);
        }

        for (let row = 0; row < this.height; row++) {
            for (let column = 0; column < this.width; column++) {
                this.checkboxes[row][column].checked = Boolean(resetState[row][column]);
            }
        }
    }

    stop() {
        this.game = null;
        clearInterval(this.interval);
    }

    updateIteration(clear = false) {
        if (clear) {
            this.iterationLabel.textContent = 0;
        } else {
            const iteration = Number(this.iterationLabel.textContent);

            this.iterationLabel.textContent = iteration + 1;
        }
    }
}
