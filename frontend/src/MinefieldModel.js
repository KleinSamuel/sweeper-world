import * as CONFIG from "./Config";
import CellChunk from "./CellChunk";

/**
 * Represents the global minefield which consists of quadratic cell chunks
 * each of which has a dedicated x and y coordinate in this global field.
 *
 * @author Samuel Klein
 */
export default class MinefieldModel {

    /**
     * Sets the coordinates of the player in the global field and
     * gets an instance of the Communicator object to be able to
     * talk to the server and send or receive field updates.
     * @param communicator
     * @param userID
     * @param chunkX
     * @param chunkY
     */
    constructor(userID, communicator, chunkX, chunkY) {

        this.com = communicator;
        this.userID = userID;
        this.chunkX = chunkX;
        this.chunkY = chunkY;
        this.field = {};
    }

    init() {
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
        return this.com.requestChunk(chunkX, chunkY).then(function(response){
            return new Promise(function(resolve, reject){
                let chunk = response.data.tiles;
                let c = new CellChunk(chunkX, chunkY);
                c.initFieldMaps(chunk);
                context.addChunk(chunkX, chunkY, c);
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

    addChunk(x, y, chunk) {
        if(!this.field[""+x]) {
            this.field[""+x] = {};
        }
        this.field[""+x][""+y] = chunk;
    }

    getChunk(x, y) {
        if (this.field[""+x] && this.field[""+x][""+y]) {
            return this.field[""+x][""+y];
        }
        return undefined;
    }

    removeChunk(x, y) {
        // removes the y coordinate dict
        if (""+x in this.field && y in this.field[""+x]) {
            delete this.field[""+x][""+y];
        }
        // checks if the x coordinate dict is empty and removes it if so
        if (Object.keys(this.field[""+x]).length === 0) {
            delete this.field[""+x];
        }
    }

    clickCell(chunkX, chunkY, x, y) {

        let cell = this.getChunk(chunkX, chunkY).getCell(x, y);

        // do nothing if the cell is flagged
        if (cell.state.hidden && cell.state.user) {
            return;
        }
        // do nothing if the cell is already opened and a mine or an empty cell
        if (!cell.state.hidden && (cell.state.value === 0 || cell.state.value === 9)) {
            return;
        }

        // contains all cells that need to be updates because of the click
        let updatedCells = [];

        // user clicked on a hidden cell
        if (cell.state.hidden) {

            // adds the clicked cell
            updatedCells.push(cell);
            // opens the clicked cell
            //cell.state.hidden = false;
            //cell.updateSprite();

            // clicked on empty cell -> open empty block
            if (cell.state.value === 0) {
                updatedCells = updatedCells.concat(this.openBlock(chunkX, chunkY, x, y));
            }
            // clicked on mine
            else if (cell.state.value === 9) {
                console.log("opened mine");
            }
        }
        // user clicked on an opened cell that contains a number
        else {
            updatedCells = updatedCells.concat(this.openAdjacent(chunkX, chunkY, x, y));
        }

        // sends all updates to the server
        for (let uCell of updatedCells) {
            uCell.state.hidden = false;
            uCell.updateSprite();
            this.com.openCell(uCell);
        }
    }

    flagCell(chunkX, chunkY, x, y) {

        let cell = this.getChunk(chunkX, chunkY).getCell(x, y);
        // returns if the flagged cell is already opened or flagged
        if (!cell.state.hidden || cell.state.hidden && cell.state.user) {
            return;
        }
        // return if the flagged cell is not a bomb
        if (cell.state.value !== 9) {
            return;
        }
        cell.state.user = 1;
        cell.updateSprite();
        this.com.flagCell(cell);
    }

    /**
     * Opens a field of empty cells and all adjacent fields.
     *
     * @param chunkX x coordinate of the chunk
     * @param chunkY y coordinate of the chunk
     * @param x coordinate of the cell
     * @param y coordinate of the cell
     */
    openBlock(chunkX, chunkY, x, y) {
        let updatedCells = [];
        let stack = this.getAdjacentCells(chunkX, chunkY, x, y);
        while (stack.length > 0) {
            let c = stack.pop();
            if (!c.state.hidden) {
                continue;
            }
            if (c.state.value  === 0) {
                stack = stack.concat(this.getAdjacentCells(c.chunkX, c.chunkY, c.x, c.y));
            }
            //c.state.hidden = false;
            //c.updateSprite();
            updatedCells.push(c);
        }
        return updatedCells;
    }

    openAdjacent(chunkX, chunkY, x, y) {
        let adj = this.getAdjacentCells(chunkX, chunkY, x, y);
        let toOpen = [];
        for (let cell of adj) {
            if (cell.state.hidden) {
                if (cell.state.value === 9) {
                    if (!cell.state.user) {
                        return [];
                    }
                } else {
                    toOpen.push(cell);
                    if (cell.state.value === 0) {
                        toOpen = toOpen.concat(this.openBlock(cell.chunkX, cell.chunkY, cell.x, cell.y));
                    }
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
     * @param x coordinate of the cell
     * @param y coordinate of the cell
     * @returns {[]} list of adjacent cells
     */
    getAdjacentCells(chunkX, chunkY, x, y) {
        let adjacentCells = [];
        chunkX = parseInt(chunkX);
        chunkY = parseInt(chunkY);
        x = parseInt(x);
        y = parseInt(y);
        adjacentCells.push(this.getTopCell(chunkX, chunkY, x, y));
        adjacentCells.push(this.getTopRightCell(chunkX, chunkY, x, y));
        adjacentCells.push(this.getRightCell(chunkX, chunkY, x, y));
        adjacentCells.push(this.getBottomRightCell(chunkX, chunkY, x, y));
        adjacentCells.push(this.getBottomCell(chunkX, chunkY, x, y));
        adjacentCells.push(this.getBottomLeftCell(chunkX, chunkY, x, y));
        adjacentCells.push(this.getLeftCell(chunkX, chunkY, x, y));
        adjacentCells.push(this.getTopLeftCell(chunkX, chunkY, x, y));
        return adjacentCells;
    }

    /**
     * Returns the cell left to the cell of the given coordinates
     *
     * @param chunkX x coordinate of the chunk
     * @param chunkY y coordinate of the chunk
     * @param x coordinate of the cell
     * @param y coordinate of the cell
     * @returns {Cell}
     */
    getLeftCell(chunkX, chunkY, x, y) {
        if (x === 0) {
            return this.getChunk(chunkX - 1, chunkY).getCell(CONFIG.CHUNK_SIZE - 1, y);
        }
        return this.getChunk(chunkX, chunkY).getCell(x - 1, y);
    }
    /**
     * Returns the cell right to the cell of the given coordinates
     *
     * @param chunkX x coordinate of the chunk
     * @param chunkY y coordinate of the chunk
     * @param x coordinate of the cell
     * @param y coordinate of the cell
     * @returns {Cell}
     */
    getRightCell(chunkX, chunkY, x, y) {
        if (x === CONFIG.CHUNK_SIZE - 1) {
            return this.getChunk(chunkX + 1, chunkY).getCell(0, y);
        }
        return this.getChunk(chunkX, chunkY).getCell(x + 1, y);
    }
    /**
     * Returns the cell to the top of the cell of the given coordinates
     *
     * @param chunkX x coordinate of the chunk
     * @param chunkY y coordinate of the chunk
     * @param x coordinate of the cell
     * @param y coordinate of the cell
     * @returns {Cell}
     */
    getTopCell(chunkX, chunkY, x, y) {
        if (y === 0) {
            return this.getChunk(chunkX, chunkY - 1).getCell(x, CONFIG.CHUNK_SIZE - 1);
        }
        return this.getChunk(chunkX, chunkY).getCell(x, y - 1);
    }
    /**
     * Returns the cell to the bottom of the cell of the given coordinates
     *
     * @param chunkX x coordinate of the chunk
     * @param chunkY y coordinate of the chunk
     * @param x coordinate of the cell
     * @param y coordinate of the cell
     * @returns {Cell}
     */
    getBottomCell(chunkX, chunkY, x, y) {
        if (y === CONFIG.CHUNK_SIZE - 1) {
            return this.getChunk(chunkX, chunkY + 1).getCell(x, 0);
        }
        return this.getChunk(chunkX, chunkY).getCell(x, y + 1);
    }
    /**
     * Returns the cell to the top left of the cell of the given coordinates
     *
     * @param chunkX x coordinate of the chunk
     * @param chunkY y coordinate of the chunk
     * @param x coordinate of the cell
     * @param y coordinate of the cell
     * @returns {Cell}
     */
    getTopLeftCell(chunkX, chunkY, x, y) {
        if (x === 0 && y === 0) {
            return this.getChunk(chunkX - 1, chunkY - 1).getCell(CONFIG.CHUNK_SIZE - 1, CONFIG.CHUNK_SIZE - 1);
        } else if(x === 0) {
            return this.getChunk(chunkX - 1, chunkY).getCell(CONFIG.CHUNK_SIZE - 1, y - 1);
        } else if(y === 0) {
            return this.getChunk(chunkX, chunkY - 1).getCell(x - 1, CONFIG.CHUNK_SIZE - 1);
        }
        return this.getChunk(chunkX, chunkY).getCell(x - 1, y - 1);
    }
    /**
     * Returns the cell to the top right of the cell of the given coordinates
     *
     * @param chunkX x coordinate of the chunk
     * @param chunkY y coordinate of the chunk
     * @param x coordinate of the cell
     * @param y coordinate of the cell
     * @returns {Cell}
     */
    getTopRightCell(chunkX, chunkY, x, y) {
        if (x === CONFIG.CHUNK_SIZE - 1 && y === 0) {
            return this.getChunk(chunkX + 1, chunkY - 1).getCell(0, CONFIG.CHUNK_SIZE - 1);
        } else if(x === CONFIG.CHUNK_SIZE - 1) {
            return this.getChunk(chunkX + 1, chunkY).getCell(0, y - 1);
        } else if(y === 0) {
            return this.getChunk(chunkX, chunkY - 1).getCell(x + 1, CONFIG.CHUNK_SIZE - 1);
        }
        return this.getChunk(chunkX, chunkY).getCell(x + 1, y - 1);
    }
    /**
     * Returns the cell to the bottom left of the cell of the given coordinates
     *
     * @param chunkX x coordinate of the chunk
     * @param chunkY y coordinate of the chunk
     * @param x coordinate of the cell
     * @param y coordinate of the cell
     * @returns {Cell}
     */
    getBottomLeftCell(chunkX, chunkY, x, y) {
        if (x === 0 && y === CONFIG.CHUNK_SIZE - 1) {
            return this.getChunk(chunkX - 1, chunkY + 1).getCell(CONFIG.CHUNK_SIZE - 1, 0);
        } else if(x === 0) {
            return this.getChunk(chunkX - 1, chunkY).getCell(CONFIG.CHUNK_SIZE - 1, y + 1);
        } else if(y === CONFIG.CHUNK_SIZE - 1) {
            return this.getChunk(chunkX, chunkY + 1).getCell(x - 1, 0);
        }
        return this.getChunk(chunkX, chunkY).getCell(x - 1, y + 1);
    }
    /**
     * Returns the cell to the bottom right of the cell of the given coordinates
     *
     * @param chunkX x coordinate of the chunk
     * @param chunkY y coordinate of the chunk
     * @param x coordinate of the cell
     * @param y coordinate of the cell
     * @returns {Cell}
     */
    getBottomRightCell(chunkX, chunkY, x, y) {
        if (x === CONFIG.CHUNK_SIZE - 1 && y === CONFIG.CHUNK_SIZE - 1) {
            return this.getChunk(chunkX + 1, chunkY + 1).getCell(0, 0);
        } else if(x === CONFIG.CHUNK_SIZE - 1) {
            return this.getChunk(chunkX + 1, chunkY).getCell(0, y + 1);
        } else if(y === CONFIG.CHUNK_SIZE - 1) {
            return this.getChunk(chunkX, chunkY + 1).getCell(x + 1, 0);
        }
        return this.getChunk(chunkX, chunkY).getCell(x + 1, y + 1);
    }
}