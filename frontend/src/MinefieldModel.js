import CellChunk from "./CellChunk";

/*
    Represents the global minefield which consists of quadratic cell chunks.
 */
export default class MinefieldModel {

    constructor(chunkX, chunkY, x, y) {
        console.log("MinefieldModel created");

        this.centerChunkX = chunkX;
        this.centerChunkY = chunkY;
        this.centerX = x;
        this.centerY = y;
        this.field = {};
    }

    init() {
        let x = 0;
        let y = 0;
        let c = new CellChunk(x, y);
        c.initTest();
        this.addChunk(x, y, c);
    }

    addChunk(x, y, chunk) {
        if(!this.field[x]) {
            this.field[x] = {};
        }
        this.field[x][y] = chunk;
    }

    getChunk(x, y) {
        if (this.field[x] && this.field[x][y]) {
            return this.field[x][y];
        }
        return undefined;
    }
}