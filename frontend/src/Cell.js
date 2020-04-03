import * as PIXI from "pixi.js";
import * as CONFIG from "./Config";
import {textures} from "./TextureLoader";

/**
 * Represents a single cell within a cell chunk.
 * It has a local x and y coordinaten within that chunk.
 *
 * @author Samuel Klein
 */
export default class Cell extends PIXI.Container {

    /**
     * Initializes a cell.
     * State: {
     *      isHidden: boolean,
     *      value: int (0-9),
     *      user: long (player id)
     * }
     * @param chunkX x coordinate of the chunk the cell is in
     * @param chunkY y coordinate of the chunk the cell is in
     * @param cellX coordinate of the cell in the chunk
     * @param cellY coordinate of the cell in the chunk
     * @param state of the cell
     */
    constructor(chunkX, chunkY, cellX, cellY, state) {
        super();

        this.chunkX = chunkX;
        this.chunkY = chunkY;
        this.cellX = cellX;
        this.cellY = cellY;

        this.sprite = new PIXI.Sprite();
        this.sprite.interactive = true;

        this.sprite.width = CONFIG.CELL_PIXEL_SIZE;
        this.sprite.height = CONFIG.CELL_PIXEL_SIZE;
        this.addChild(this.sprite);

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

    showScore(factor) {
        if (this.state.value === 0)
            return;
        let message = factor;
        let color = CONFIG.COLOR_GOOD;
        if ((this.state.value === 9 && !this.state.hidden) || (this.state.hidden && this.state.user !== CONFIG.getID())) {
            color = CONFIG.COLOR_BAD;
            message = "\u2193" + message + "x";
        } else
            message = "x" + message;

        let alpha = 1.0;
        let f = new PIXI.Text(message, {
            fontSize: 16,
            alpha: alpha,
            fill: color,
        });
        this.addChild(f);
        let context = this;
        let interval = setInterval(function () {
            f.alpha = alpha;
            alpha -= 0.02;
            if (alpha < 0) {
                context.removeChild(f);
                clearInterval(interval);
            }
        });


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
            this.sprite.texture = textures["num" + this.state.value];
        }
    }
}