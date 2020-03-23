import Cell from "./Cell";

/*
    Represents a quadratic chunk of the global minefield consisting of 32x32 cells.
    This chunk has a global x and y coordinate and each cell in this chunk has a
    local x and y coordinate.
 */
export default class CellChunk {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.innerField = [];
        for (let i = 0; i < 32; i++) {
            this.innerField[i] = [];
        }
    }

    initTest(){
        for (let x = 0; x < 32; x++) {
            for (let y = 0; y < 32; y++) {
                let state = {
                    isHidden: true,
                    value: 1,
                    player: undefined
                };
                this.innerField[x][y] = new Cell(x, y, state);
            }
        }
    }

    initField(fieldStates) {
        for (let x = 0; x < fieldStates.length; x++) {
            for (let y = 0; y < fieldStates[x].length; y++) {
                this.innerField[x][y] = new Cell(x, y, fieldStates[x][y].state);
            }
        }
    }

    printChunk() {
        console.log("--- chunk x="+this.x+" y="+this.y+" ---");
        for (let x = 0; x < this.innerField.length; x++) {
            let row = ((x < 10) ? "0"+x : x)+" |";
            for (let y = 0; y < this.innerField[x].length; y++) {
                row += this.innerField[x][y].toString()+"|";
            }
            console.log(row);
        }
    }
}