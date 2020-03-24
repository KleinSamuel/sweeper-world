import * as CONFIG from "./Config";
import CellChunk from "./CellChunk";
import Communicator from "./Communicator";

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
     * @param chunkX
     * @param chunkY
     */
    constructor(chunkX, chunkY) {

        this.chunkX = chunkX;
        this.chunkY = chunkY;
        this.field = {};

        this.com = new Communicator();
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
        // calculates new x coordinate
        let genX = this.chunkX+(CONFIG.BUFFER_ADD*direction);

        // calculates all buffered y coordinates for the new chunks
        for (let i = -1 * CONFIG.BUFFER_ADD; i <= CONFIG.BUFFER_ADD; i++) {
            let genY = this.chunkY + i;
            // checks if the chunk is already in buffer
            if (!this.containsChunk(genX, genY)) {
                // gets and adds the new junk to the buffer
                let c = this.retrieveChunkFromServer(genX, genY);
                this.addChunk(genX, genY, c);
            }
        }

        // computes the chunks that are out of buffer and can be removed
        let toRemove = [];
        for (let i in this.field) {
            for (let j in this.field[i]) {
                if (Math.abs(this.chunkX - i) > CONFIG.BUFFER_REMOVE) {
                    toRemove.push([i, j]);
                }
            }
        }
        // removes the identified chunks
        for (let i in toRemove) {
            this.removeChunk(toRemove[i][0], toRemove[i][1]);
        }
    }

    moveY(direction) {
        // calculates new y coordinate
        let genY = this.chunkY+(CONFIG.BUFFER_ADD*direction);

        // calculates all buffered x coordinates for the new chunks
        for (let i = -1 * CONFIG.BUFFER_ADD; i <= CONFIG.BUFFER_ADD; i++) {
            let genX = this.chunkX + i;
            // checks if the chunk is already in buffer
            if (!this.containsChunk(genX, genY)) {
                // gets and adds the new junk to the buffer
                let c = this.retrieveChunkFromServer(genX, genY);
                this.addChunk(genX, genY, c);
            }
        }

        // computes the chunks that are out of buffer and can be removed
        let toRemove = [];
        for (let i in this.field) {
            for (let j in this.field[i]) {
                if (Math.abs(this.chunkY - j) > CONFIG.BUFFER_REMOVE) {
                    toRemove.push([i, j]);
                }
            }
        }
        // removes the identified chunks
        for (let i in toRemove) {
            this.removeChunk(toRemove[i][0], toRemove[i][1]);
        }
    }

    addChunk(x, y, chunk) {
        if(!this.field[""+x]) {
            this.field[""+x] = {};
        }
        this.field[""+x][""+y] = chunk;
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

    getChunk(x, y) {
        if (this.field[""+x] && this.field[""+x][""+y]) {
            return this.field[""+x][""+y];
        }
        return undefined;
    }

    clickCell(chunkX, chunkY, x, y) {
        // TODO: remove fake state with real state from server
        let status = {
            isHidden: false,
            value: 0,
            player: 1
        };

        let chunk = this.getChunk(chunkX, chunkY);
        let cell = chunk.getCell(x, y);
        cell.setState(status);
    }

    flagCell(chunkX, chunkY, x, y) {
        // TODO: remove fake state with real state from server
        let status = {
            isHidden: true,
            value: 0,
            player: 1
        };

        let chunk = this.getChunk(chunkX, chunkY);
        let cell = chunk.getCell(x, y);
        cell.setState(status);
    }
}