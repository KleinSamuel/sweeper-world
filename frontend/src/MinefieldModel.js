import CellChunk from "./CellChunk";

/*
    Represents the global minefield which consists of quadratic cell chunks.
 */
export default class MinefieldModel {

    constructor(chunkX, chunkY) {
        console.log("MinefieldModel created");

        this.BUFFER = 1;
        this.BUFFER_REMOVE = 1;

        this.chunkX = chunkX;
        this.chunkY = chunkY;
        this.field = {};
        this.init();
    }

    init() {
        for (let i = this.chunkX - this.BUFFER; i <= this.chunkX + this.BUFFER; i++) {
            for (let j = this.chunkY - this.BUFFER; j <= this.chunkY + this.BUFFER; j++) {
                let c = this.retrieveChunkFromServer(i, j);
                this.addChunk(i, j, c);
            }
        }
    }

    retrieveChunkFromServer(chunkX, chunkY) {
        // TODO: implement request to server
        let c = new CellChunk(chunkX, chunkY);
        c.initTest();
        return c;
    }

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
        let genX = this.chunkX+(this.BUFFER*direction);

        // calculates all buffered y coordinates for the new chunks
        for (let i = -1 * this.BUFFER; i <= this.BUFFER; i++) {
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
                if (Math.abs(this.chunkX - i) > this.BUFFER_REMOVE) {
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
        let genY = this.chunkY+(this.BUFFER*direction);

        // calculates all buffered x coordinates for the new chunks
        for (let i = -1 * this.BUFFER; i <= this.BUFFER; i++) {
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
                if (Math.abs(this.chunkY - j) > this.BUFFER_REMOVE) {
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