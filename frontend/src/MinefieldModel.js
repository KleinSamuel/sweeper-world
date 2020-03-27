import * as CONFIG from "./Config";
import * as PIXI from "pixi.js";
import {sounds} from "./Sounds";
import CellChunk from "./CellChunk";

/**
 * Represents the global minefield which consists of quadratic cell chunks
 * each of which has a dedicated x and y coordinate in this global field.
 *
 * @author Samuel Klein
 */
export default class MinefieldModel extends PIXI.Container {

    /**
     * Sets the coordinates of the player in the global field and
     * gets an instance of the Communicator object to be able to
     * talk to the server and send or receive field updates.
     * @param communicator
     * @param userID
     * @param chunkX
     * @param chunkY
     */
    constructor(communicator, chunkX, chunkY) {
        super();
        this.com = communicator;
        this.chunkX = chunkX;
        this.chunkY = chunkY;
        this.field = {};
    }

    init() {
        console.log("[ INFO ] MinefieldModel initialized");

        let context = this;
        return new Promise(function(resolve, reject){
            let promiseStack = [];
            for (let i = context.chunkX - CONFIG.BUFFER_ADD; i <= context.chunkX + CONFIG.BUFFER_ADD; i++) {
                for (let j = context.chunkY - CONFIG.BUFFER_ADD; j <= context.chunkY + CONFIG.BUFFER_ADD; j++) {
                    promiseStack.push(context.retrieveChunkFromServer(i, j));
                }
            }
            Promise.all(promiseStack).then(resolve);
        });
    }

    /**
     * Retrieves a cell chunk of given coordinates from the server.
     * Stores alls the cells of this chunk in the local model and adds the cells
     * to the scene so they are visible to the player.
     *
     * @param chunkX x coordinate of the chunk
     * @param chunkY y coordinate of the chunk
     * @returns {Promise}
     */
    retrieveChunkFromServer(chunkX, chunkY) {
        let context = this;

        let clickWrapper = (function(isLeftclick, chunkX, chunkY, cellX, cellY) {
            if (isLeftclick) {
                this.clickCell(chunkX, chunkY, cellX, cellY);
            } else {
                this.flagCell(chunkX, chunkY, cellX, cellY);
            }
        }).bind(this);

        return this.com.requestChunk(chunkX, chunkY).then(function(response){
            return new Promise(function(resolve, reject){
                let chunk = response.data.tiles;

                let c = new CellChunk(chunkX, chunkY);
                c.position.set(chunkX * CONFIG.CHUNK_PIXEL_SIZE, chunkY * CONFIG.CHUNK_PIXEL_SIZE);

                c.initFieldMaps(chunk);

                for (let i = 0; i < c.innerField.length; i++) {
                    for (let j = 0; j < c.innerField[i].length; j++) {
                        let cell = c.innerField[i][j];
                        cell.sprite.on("mousedown", function(event) {
                            this.m_posX = event.data.global.x;
                            this.m_posY = event.data.global.y;
                        });
                        cell.sprite.on("mouseup", function(event) {
                            if (Math.abs(this.m_posX - event.data.global.x) < CONFIG.CELL_PIXEL_SIZE &&
                                Math.abs(this.m_posY - event.data.global.y) < CONFIG.CELL_PIXEL_SIZE) {
                                clickWrapper(true, cell.chunkX, cell.chunkY, cell.cellX, cell.cellY);
                            }
                        });
                        cell.sprite.on("rightdown", function(event) {
                            this.m_posX = event.data.global.x;
                            this.m_posY = event.data.global.y;
                        });
                        cell.sprite.on("rightup", function(event) {
                            if (Math.abs(this.m_posX - event.data.global.x) < CONFIG.CELL_PIXEL_SIZE &&
                                Math.abs(this.m_posY - event.data.global.y) < CONFIG.CELL_PIXEL_SIZE) {
                                clickWrapper(false, cell.chunkX, cell.chunkY, cell.cellX, cell.cellY);
                            }
                        });
                    }
                }

                context.addChunk(chunkX, chunkY, c);
                context.addChild(c);
                resolve();
            });
        });
    }

    /**
     * Checks if a cell chunk of the given coordinates exists in the local buffer.
     *
     * @param chunkX x coordinate of the chunk
     * @param chunkY y coordinate of the chunk
     * @returns {boolean} true if the chunk already exists
     */
    containsChunk(chunkX, chunkY) {
        if (chunkX in this.field) {
            if (chunkY in this.field[chunkX]) {
                return true;
            }
        }
        return false;
    }

    moveX(direction) {
        let context = this;
        return new Promise(function(resolve, reject){
            let promiseStack = [];

            // calculates new x coordinate
            let genX = context.chunkX+(CONFIG.BUFFER_ADD*direction);

            // calculates all buffered y coordinates for the new chunks
            for (let i = -1 * CONFIG.BUFFER_ADD; i <= CONFIG.BUFFER_ADD; i++) {
                let genY = context.chunkY + i;
                // checks if the chunk is already in buffer
                if (!context.containsChunk(genX, genY)) {
                    // gets and adds the new junk to the buffer
                    promiseStack.push(context.retrieveChunkFromServer(genX, genY));
                }
            }
            Promise.all(promiseStack).then(resolve);
        }).then(function(){
            // computes the chunks that are out of buffer and can be removed
            let toRemove = [];
            for (let i in context.field) {
                for (let j in context.field[i]) {
                    if (Math.abs(context.chunkX - i) > CONFIG.BUFFER_REMOVE) {
                        toRemove.push([i, j]);
                    }
                }
            }
            // removes the identified chunks
            for (let i in toRemove) {
                context.removeChunk(toRemove[i][0], toRemove[i][1]);
            }
        });
    }

    moveY(direction) {
        let context = this;
        return new Promise(function(resolve, reject){
            let promiseStack = [];

            // calculates new y coordinate
            let genY = context.chunkY+(CONFIG.BUFFER_ADD*direction);

            // calculates all buffered x coordinates for the new chunks
            for (let i = -1 * CONFIG.BUFFER_ADD; i <= CONFIG.BUFFER_ADD; i++) {
                let genX = context.chunkX + i;
                // checks if the chunk is already in buffer
                if (!context.containsChunk(genX, genY)) {
                    // gets and adds the new junk to the buffer
                    promiseStack.push(context.retrieveChunkFromServer(genX, genY));
                }
            }
            Promise.all(promiseStack).then(resolve);
        }).then(function(){
            // computes the chunks that are out of buffer and can be removed
            let toRemove = [];
            for (let i in context.field) {
                for (let j in context.field[i]) {
                    if (Math.abs(context.chunkY - j) > CONFIG.BUFFER_REMOVE) {
                        toRemove.push([i, j]);
                    }
                }
            }
            // removes the identified chunks
            for (let i in toRemove) {
                context.removeChunk(toRemove[i][0], toRemove[i][1]);
            }
        });

    }

    addChunk(cellX, cellY, chunk) {
        if(!this.field[""+cellX]) {
            this.field[""+cellX] = {};
        }
        this.field[""+cellX][""+cellY] = chunk;
    }

    getChunk(cellX, cellY) {
        if (this.field[""+cellX] && this.field[""+cellX][""+cellY]) {
            return this.field[""+cellX][""+cellY];
        }
        return undefined;
    }

    removeChunk(cellX, cellY) {
        // removes the y coordinate dict
        if (""+cellX in this.field && ""+cellY in this.field[""+cellX]) {
            delete this.field[""+cellX][""+cellY];
        }
        // checks if the x coordinate dict is empty and removes it if so
        if (Object.keys(this.field[""+cellX]).length === 0) {
            delete this.field[""+cellX];
        }
    }

    clickCell(chunkX, chunkY, cellX, cellY) {

        let cell = this.getChunk(chunkX, chunkY).getCell(cellX, cellY);

        // do nothing if the cell is flagged
        if (cell.state.hidden && cell.state.user) {
            sounds.click_no.play();
            return;
        }
        // do nothing if the cell is already opened and a mine or an empty cell
        if (!cell.state.hidden && (cell.state.value === 0 || cell.state.value === 9)) {
            sounds.click_no.play();
            return;
        }

        // contains all cells that need to be updates because of the click
        let updatedCells = [];

        // user clicked on a hidden cell
        if (cell.state.hidden) {

            // adds the clicked cell
            updatedCells.push(cell);
            // opens the clicked cell
            cell.state.hidden = false;
            cell.updateSprite();

            // clicked on empty cell -> open empty block
            if (cell.state.value === 0) {
                updatedCells = updatedCells.concat(this.openBlock(chunkX, chunkY, cellX, cellY));
            }
            // clicked on mine
            else if (cell.state.value === 9) {
                sounds.explosion.play();
            }
        }
        // user clicked on an opened cell that contains a number
        else {
            updatedCells = updatedCells.concat(this.openAdjacent(chunkX, chunkY, cellX, cellY));
            if (updatedCells.length === 0) {
                sounds.click_no.play();
                return;
            }
            for (let c of updatedCells) {
                c.state.hidden = false;
                c.updateSprite();
            }
        }

        // sends all updates to the server
        for (let uCell of updatedCells) {
            this.com.openCell(uCell);
        }
        sounds.click_cell.play();
    }

    flagCell(chunkX, chunkY, cellX, cellY) {

        let cell = this.getChunk(chunkX, chunkY).getCell(cellX, cellY);
        // returns if the flagged cell is already opened or flagged
        if (!cell.state.hidden || cell.state.hidden && cell.state.user) {
            sounds.click_no.play();
            return;
        }
        // return if the flagged cell is not a bomb
        if (cell.state.value !== 9) {
            sounds.click_error.play();
            return;
        }
        cell.state.user = 1;
        cell.updateSprite();
        this.com.flagCell(cell);

        sounds.click_flag.play();
    }

    /**
     * Opens a field of empty cells and all adjacent fields.
     *
     * @param chunkX x coordinate of the chunk
     * @param chunkY y coordinate of the chunk
     * @param cellX coordinate of the cell
     * @param cellY coordinate of the cell
     */
    openBlock(chunkX, chunkY, cellX, cellY) {

        let updatedCells = [];
        let stack = this.getAdjacentCells(chunkX, chunkY, cellX, cellY);

        while (stack.length > 0) {
            let c = stack.pop();

            // skips the cell if it already opened
            if (!c.state.hidden) {
                continue;
            }
            // adds all adjacent cells to the stack if the cell is empty
            if (c.state.value === 0) {
                let toAdd = this.getAdjacentCells(c.chunkX, c.chunkY, c.cellX, c.cellY);
                for (let cell of toAdd) {
                    if (cell.state.hidden) {
                        stack.push(cell);
                    }
                }
            }
            // adds the cell to the cell that need to be updated
            updatedCells.push(c);
            c.state.hidden = false;
            c.updateSprite();
        }

        return updatedCells;
    }

    openAdjacent(chunkX, chunkY, cellX, cellY) {
        let adj = this.getAdjacentCells(chunkX, chunkY, cellX, cellY);
        let toOpen = [];
        for (let cell of adj) {
            if (cell.state.hidden) {
                if (cell.state.value === 9) {
                    if (!cell.state.user) {
                        return [];
                    }
                } else if (cell.state.value === 0) {
                    toOpen.push(cell);
                    toOpen = toOpen.concat(this.openBlock(cell.chunkX, cell.chunkY, cell.cellX, cell.cellY));
                } else {
                    toOpen.push(cell);
                }
            }
        }
        return toOpen;
    }

    /**
     * Returns a list of all 8 adjacent cells for a cell at the given coordinates.
     *
     * @param chunkX x coordinate of the chunk
     * @param chunkY y coordinate of the chunk
     * @param cellX coordinate of the cell
     * @param cellY coordinate of the cell
     * @returns {[]} list of adjacent cells
     */
    getAdjacentCells(chunkX, chunkY, cellX, cellY) {
        let adjacentCells = [];
        chunkX = parseInt(chunkX);
        chunkY = parseInt(chunkY);
        cellX = parseInt(cellX);
        cellY = parseInt(cellY);
        adjacentCells.push(this.getTopCell(chunkX, chunkY, cellX, cellY));
        adjacentCells.push(this.getTopRightCell(chunkX, chunkY, cellX, cellY));
        adjacentCells.push(this.getRightCell(chunkX, chunkY, cellX, cellY));
        adjacentCells.push(this.getBottomRightCell(chunkX, chunkY, cellX, cellY));
        adjacentCells.push(this.getBottomCell(chunkX, chunkY, cellX, cellY));
        adjacentCells.push(this.getBottomLeftCell(chunkX, chunkY, cellX, cellY));
        adjacentCells.push(this.getLeftCell(chunkX, chunkY, cellX, cellY));
        adjacentCells.push(this.getTopLeftCell(chunkX, chunkY, cellX, cellY));
        return adjacentCells;
    }

    /**
     * Returns the cell left to the cell of the given coordinates
     *
     * @param chunkX x coordinate of the chunk
     * @param chunkY y coordinate of the chunk
     * @param cellX coordinate of the cell
     * @param cellY coordinate of the cell
     * @returns {Cell}
     */
    getLeftCell(chunkX, chunkY, cellX, cellY) {
        if (cellX === 0) {
            return this.getChunk(chunkX - 1, chunkY).getCell(CONFIG.CHUNK_SIZE - 1, cellY);
        }
        return this.getChunk(chunkX, chunkY).getCell(cellX - 1, cellY);
    }
    /**
     * Returns the cell right to the cell of the given coordinates
     *
     * @param chunkX x coordinate of the chunk
     * @param chunkY y coordinate of the chunk
     * @param cellX coordinate of the cell
     * @param cellY coordinate of the cell
     * @returns {Cell}
     */
    getRightCell(chunkX, chunkY, cellX, cellY) {
        if (cellX === CONFIG.CHUNK_SIZE - 1) {
            return this.getChunk(chunkX + 1, chunkY).getCell(0, cellY);
        }
        return this.getChunk(chunkX, chunkY).getCell(cellX + 1, cellY);
    }
    /**
     * Returns the cell to the top of the cell of the given coordinates
     *
     * @param chunkX x coordinate of the chunk
     * @param chunkY y coordinate of the chunk
     * @param cellX coordinate of the cell
     * @param cellY coordinate of the cell
     * @returns {Cell}
     */
    getTopCell(chunkX, chunkY, cellX, cellY) {
        if (cellY === 0) {
            return this.getChunk(chunkX, chunkY - 1).getCell(cellX, CONFIG.CHUNK_SIZE - 1);
        }
        return this.getChunk(chunkX, chunkY).getCell(cellX, cellY - 1);
    }
    /**
     * Returns the cell to the bottom of the cell of the given coordinates
     *
     * @param chunkX x coordinate of the chunk
     * @param chunkY y coordinate of the chunk
     * @param cellX coordinate of the cell
     * @param cellY coordinate of the cell
     * @returns {Cell}
     */
    getBottomCell(chunkX, chunkY, cellX, cellY) {
        if (cellY === CONFIG.CHUNK_SIZE - 1) {
            return this.getChunk(chunkX, chunkY + 1).getCell(cellX, 0);
        }
        return this.getChunk(chunkX, chunkY).getCell(cellX, cellY + 1);
    }
    /**
     * Returns the cell to the top left of the cell of the given coordinates
     *
     * @param chunkX x coordinate of the chunk
     * @param chunkY y coordinate of the chunk
     * @param x coordinate of the cell
     * @param cellY coordinate of the cell
     * @returns {Cell}
     */
    getTopLeftCell(chunkX, chunkY, cellX, cellY) {
        if (cellX === 0 && cellY === 0) {
            return this.getChunk(chunkX - 1, chunkY - 1).getCell(CONFIG.CHUNK_SIZE - 1, CONFIG.CHUNK_SIZE - 1);
        } else if(cellX === 0) {
            return this.getChunk(chunkX - 1, chunkY).getCell(CONFIG.CHUNK_SIZE - 1, cellY - 1);
        } else if(cellY === 0) {
            return this.getChunk(chunkX, chunkY - 1).getCell(cellX - 1, CONFIG.CHUNK_SIZE - 1);
        }
        return this.getChunk(chunkX, chunkY).getCell(cellX - 1, cellY - 1);
    }
    /**
     * Returns the cell to the top right of the cell of the given coordinates
     *
     * @param chunkX x coordinate of the chunk
     * @param chunkY y coordinate of the chunk
     * @param cellX coordinate of the cell
     * @param cellY coordinate of the cell
     * @returns {Cell}
     */
    getTopRightCell(chunkX, chunkY, cellX, cellY) {
        if (cellX === CONFIG.CHUNK_SIZE - 1 && cellY === 0) {
            return this.getChunk(chunkX + 1, chunkY - 1).getCell(0, CONFIG.CHUNK_SIZE - 1);
        } else if(cellX === CONFIG.CHUNK_SIZE - 1) {
            return this.getChunk(chunkX + 1, chunkY).getCell(0, cellY - 1);
        } else if(cellY === 0) {
            return this.getChunk(chunkX, chunkY - 1).getCell(cellX + 1, CONFIG.CHUNK_SIZE - 1);
        }
        return this.getChunk(chunkX, chunkY).getCell(cellX + 1, cellY - 1);
    }
    /**
     * Returns the cell to the bottom left of the cell of the given coordinates
     *
     * @param chunkX x coordinate of the chunk
     * @param chunkY y coordinate of the chunk
     * @param cellX coordinate of the cell
     * @param cellY coordinate of the cell
     * @returns {Cell}
     */
    getBottomLeftCell(chunkX, chunkY, cellX, cellY) {
        if (cellX === 0 && cellY === CONFIG.CHUNK_SIZE - 1) {
            return this.getChunk(chunkX - 1, chunkY + 1).getCell(CONFIG.CHUNK_SIZE - 1, 0);
        } else if(cellX === 0) {
            return this.getChunk(chunkX - 1, chunkY).getCell(CONFIG.CHUNK_SIZE - 1, cellY + 1);
        } else if(cellY === CONFIG.CHUNK_SIZE - 1) {
            return this.getChunk(chunkX, chunkY + 1).getCell(cellX - 1, 0);
        }
        return this.getChunk(chunkX, chunkY).getCell(cellX - 1, cellY + 1);
    }
    /**
     * Returns the cell to the bottom right of the cell of the given coordinates
     *
     * @param chunkX x coordinate of the chunk
     * @param chunkY y coordinate of the chunk
     * @param cellX coordinate of the cell
     * @param cellY coordinate of the cell
     * @returns {Cell}
     */
    getBottomRightCell(chunkX, chunkY, cellX, cellY) {
        if (cellX === CONFIG.CHUNK_SIZE - 1 && cellY === CONFIG.CHUNK_SIZE - 1) {
            return this.getChunk(chunkX + 1, chunkY + 1).getCell(0, 0);
        } else if(cellX === CONFIG.CHUNK_SIZE - 1) {
            return this.getChunk(chunkX + 1, chunkY).getCell(0, cellY + 1);
        } else if(cellY === CONFIG.CHUNK_SIZE - 1) {
            return this.getChunk(chunkX, chunkY + 1).getCell(cellX + 1, 0);
        }
        return this.getChunk(chunkX, chunkY).getCell(cellX + 1, cellY + 1);
    }
}