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
     * @param state
     */
    constructor(state) {
        this.sprite = undefined;
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
        if (this.state.isHidden && !this.state.user) {
            this.sprite = new PIXI.Sprite(textures.closed);
        } else if (this.state.isHidden && this.state.user) {
            this.sprite = new PIXI.Sprite(textures.flag);
        } else if (this.state.value === 0) {
            this.sprite = new PIXI.Sprite(textures.open);
        } else if (this.state.value === 9) {
            this.sprite = new PIXI.Sprite(textures.mine);
        } else {
            this.sprite = new PIXI.Sprite(textures["num"+this.state.value]);
        }
    }
}