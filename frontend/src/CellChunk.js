import * as CONFIG from "./Config";
import Cell from "./Cell";

/**
 * Represents a quadratic chunk of the global minefield consisting of 32x32 cells.
 * This chunk has a global x and y coordinate and each cell in this chunk has a
 * local x and y coordinate.
 *
 * @author Samuel Klein
 */
export default class CellChunk {

    /**
     * Initializes the dictionary which contains the cells.
     */
    constructor(chunkX, chunkY) {
        this.chunkX = chunkX;
        this.chunkY = chunkY;

        this.innerField = [];
        for (let i = 0; i < CONFIG.CHUNK_SIZE; i++) {
            this.innerField[i] = [];
        }
    }

    initField(fieldStates) {
        for (let x = 0; x < fieldStates.length; x++) {
            for (let y = 0; y < fieldStates[x].length; y++) {
                this.innerField[x][y] = new Cell(this.chunkX, this.chunkY, x, y, fieldStates[x][y].state);
            }
        }
    }

    /**
     * Updates the internal cells of this chunk with the given cell information.
     * The cells are organized in an outer dictionary whose keys are the x coordinate.
     * Each x coordinate contains another dictionary whose keys are the y coordinate and
     * the value is the cell state dictionary.
     * @param fieldStates
     */
    initFieldMaps(fieldStates) {
        for (let x in fieldStates) {
            for (let y in fieldStates[x]) {
                this.innerField[x][y] = new Cell(this.chunkX, this.chunkY, x, y, fieldStates[x][y]);
            }
        }
    }

    /**
     * Returns the cell object of the cell at the given coordinates within this chunk.
     * @param x coordinate
     * @param y coordinate
     * @returns {Cell}
     */
    getCell(x, y) {
        return this.innerField[x][y];
    }
}