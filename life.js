function $(selector, container) {
    return (container || document).querySelector(selector);
}


(function(){
    var _ = self.Life = function(seed){
        this.seed = seed;
        this.height = seed.length;
        this.width = seed[0].length;
        
        this.prevBoard = [];
        this.board = cloneArray(seed);
    };
    
    _.prototype = {
        next: function() {
            this.prevBoard = cloneArray(this.board);
            
            for (var y = 0; y < this.height; y++) {
                for (var x = 0; x < this.width; x++) {
                    var aliveCount = this.aliveNeighbors (this.prevBoard, x, y);
                    
                    switch (aliveCount)
                    {
                        //Two Neighbors, there is no change to it's state
                        case 2:
                            break;
                        //Three Neighbors, the cell comes alive, if its dead or just stays alive
                        case 3:
                            this.board[y][x] = 1;
                            break;
                        //Any other scenario puts the cell to death
                        default:
                            this.board[y][x] = 0;
                            break;
                            
                    }
                }
            }
        },
        
        aliveNeighbors: function (array, x, y) {
            var aliveCount = 0;
            for(var yPrime = y-1; yPrime < y+2; yPrime++) { 
                if(!array[yPrime]) continue;
                
                for(var xPrime = x-1; xPrime < x+2; xPrime++) {   
                    if(yPrime === y && xPrime === x) continue;
                    aliveCount += +!!array[yPrime][xPrime];
                }    
            }
            return aliveCount;
        },
        
        toString: function() {
            return this.board.map(function(row) { return row.join(' '); }).join('\n');
        }
    };
    
    
    //Helpers
    //Warning: Only clones 2D arrays
    function cloneArray(array) {
        return array.slice().map(function(row) { return row.slice();});
    };
})();

(function() {
    var _ = self.LifeView = function(table, width, height) {
        this.grid = table;
        this.width = width;
        this.height = height;
        this.started = false;
        this.autoplay = false;
        
        this.createGrid();
    }; 
    
    _.prototype = {
        createGrid: function() {   
            var self= this;
            var fragment = document.createDocumentFragment();
            this.grid.innerHTML = '';
            this.checkboxes = [];
            
            for(var row = 0; row < this.height; row++) { 
                
                var rowElement = document.createElement('tr');
                this.checkboxes[row] = [];
                
                for(var column = 0; column < this.width; column++) {
                    var cell = document.createElement('td');
                    var checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.location = {row: row, column: column};
                    this.checkboxes[row][column] = checkbox;
                    
                    
                    cell.appendChild(checkbox);
                    rowElement.appendChild(cell);
                }
                fragment.appendChild(rowElement);
            }
            
            this.grid.addEventListener('keyup', function(event) {
                var checkbox = evt.target;
                
                if (checkbox.nodeName.toLowerCase === 'input'){
                    var row = checkbox.location.row;
                    var column = checkbox.location.column;
                    switch (event.keyCode){
                        case 37: //left
                        case 38: //up
                        case 39: //right
                        case 40: //down
                    }
                }
            });
            
            this.grid.addEventListener('change', function(evt) {
                if(evt.target.nodeType === 'input'){
                    self.started = false;
                }
            });
            this.grid.appendChild(fragment);
        },
        
        get boardArray() {
          return this.checkboxes.map(function(row){
              return row.map(function(checkbox) { return +checkbox.checked; });
          });  
        },
        
        play: function () {
            this.game = new Life(this.boardArray);
            this.started = true;
        },
        
        next: function () {
            var self = this;
            
            if(!this.started || !!this.game){
                this.play();
            }
            
            this.game.next();
            
            var board = this.game.board;
            
            for(var row = 0; row < this.height; row++) {
                for(var column = 0; column < this.width; column++) {
                    this.checkboxes[row][column].checked = !!board[row][column]
                }
            }
            
            if(this.autoplay) {
                setTimeout(function() {
                    self.next();
                }, 1000)
            }
        }         
    };
})();

var view = new LifeView($("#grid"), 150, 150);
(function() {
    var buttons = {
      next: $('button.next')  
    };
    
    buttons.next.addEventListener('click', function(event) {
        view.next();
    });

    $('#autoplay').addEventListener('change', function(event) {
        buttons.next.textContent = this.checked ? 'Start' : 'Next';
        view.autoplay = this.checked;
    });
})();
