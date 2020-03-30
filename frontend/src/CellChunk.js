import * as CONFIG from "./Config";
import * as PIXI from "pixi.js";
import Cell from "./Cell";

/**
 * Represents a quadratic chunk of the global minefield consisting of 32x32 cells.
 * This chunk has a global x and y coordinate and each cell in this chunk has a
 * local x and y coordinate.
 *
 * @author Samuel Klein
 */
export default class CellChunk extends PIXI.Container {

    /**
     * Initializes the dictionary which contains the cells.
     */
    constructor(chunkX, chunkY) {
        super();
        this.chunkX = chunkX;
        this.chunkY = chunkY;

        this.innerField = [];
        for (let i = 0; i < CONFIG.CHUNK_SIZE; i++) {
            this.innerField[i] = [];
        }

        this.visible = false;
    }

    /**
     * Updates the internal cells of this chunk with the given cell information.
     * The cells are organized in an outer dictionary whose keys are the x coordinate.
     * Each x coordinate contains another dictionary whose keys are the y coordinate and
     * the value is the cell state dictionary.
     * @param fieldStates
     * @param callback function to be executed on cell click
     */
    initFieldMaps(fieldStates) {

        for (let cellX = 0; cellX < CONFIG.CHUNK_SIZE; cellX++) {
            for (let cellY = 0; cellY < CONFIG.CHUNK_SIZE; cellY++) {
                let tmpState = {
                    hidden: true,
                    value: null,
                    user: null
                };
                if (cellX in fieldStates && cellY in fieldStates[cellX]) {
                    tmpState = fieldStates[cellX][cellY];
                }
                this.innerField[cellX][cellY] = new Cell(this.chunkX, this.chunkY, cellX, cellY, tmpState);
                this.innerField[cellX][cellY].position.set(cellX * CONFIG.CELL_PIXEL_SIZE, cellY * CONFIG.CELL_PIXEL_SIZE);
                this.addChild(this.innerField[cellX][cellY]);
            }
        }
    }

    /**
     * Returns the cell object of the cell at the given coordinates within this chunk.
     * @param cellX coordinate
     * @param cellY coordinate
     * @returns {Cell}
     */
    getCell(cellX, cellY) {
        return this.innerField[cellX][cellY];
    }

    setCell(cellX,cellY,cell) {
        this.innerField[cellY][cellX] = cell;
    }
}