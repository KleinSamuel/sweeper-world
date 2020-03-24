import * as CONFIG from "./Config";
import Cell from "./Cell";

/*
    Represents a quadratic chunk of the global minefield consisting of 32x32 cells.
    This chunk has a global x and y coordinate and each cell in this chunk has a
    local x and y coordinate.
 */
export default class CellChunk {

    constructor() {
        this.innerField = [];
        for (let i = 0; i < CONFIG.CHUNK_SIZE; i++) {
            this.innerField[i] = [];
        }
    }

    initTest(){
        for (let x = 0; x < CONFIG.CHUNK_SIZE; x++) {
            for (let y = 0; y < CONFIG.CHUNK_SIZE; y++) {
                let state = {
                    isHidden: true,
                    value: 1,
                    player: undefined
                };
                this.innerField[x][y] = new Cell(state);
            }
        }
    }

    initField(fieldStates) {
        for (let x = 0; x < fieldStates.length; x++) {
            for (let y = 0; y < fieldStates[x].length; y++) {
                this.innerField[x][y] = new Cell(fieldStates[x][y].state);
            }
        }
    }

    initFieldMaps(fieldStates) {
        for (let x in fieldStates) {
            for (let y in fieldStates[x]) {
                this.innerField[x][y] = new Cell(fieldStates[x][y]);
            }
        }
    }

    getCell(x, y) {
        return this.innerField[x][y];
    }
}