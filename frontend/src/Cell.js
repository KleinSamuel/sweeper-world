import * as PIXI from "pixi.js";
import { textures } from "./TextureLoader";

/**
 * Represents a single cell within a cell chunk.
 * It has a local x and y coordinaten within that chunk.
 *
 * @author Samuel Klein
 */
export default class Cell {

    /**
     * Initializes a cell.
     * State: {
     *      isHidden: boolean,
     *      value: int (0-9),
     *      user: long (player id)
     * }
     * @param chunkX x coordinate of the chunk the cell is in
     * @param chunkY y coordinate of the chunk the cell is in
     * @param x coordinate of the cell in the chunk
     * @param y coordinate of the cell in the chunk
     * @param state of the cell
     */
    constructor(chunkX, chunkY, x, y, state) {
        this.chunkX = chunkX;
        this.chunkY = chunkY;
        this.x = x;
        this.y = y;
        this.sprite = new PIXI.Sprite();
        this.sprite.interactive = true;
        this.setState(state);
    }

    /**
     * Updates the state and the sprite of the cell.
     * @param state
     */
    setState(state) {
        this.state = state;
        this.updateSprite();
    }

    /**
     * Updates the internal sprite object to the respective
     * texture of the cell state.
     */
    updateSprite() {
        if (this.state.hidden && !this.state.user) {
            this.sprite.texture = textures.closed;
        } else if (this.state.hidden && this.state.user) {
            this.sprite.texture = textures.flag;
        } else if (this.state.value === 0) {
            this.sprite.texture = textures.open;
        } else if (this.state.value === 9) {
            this.sprite.texture = textures.mine;
        } else {
            this.sprite.texture = textures["num"+this.state.value];
        }
    }
}