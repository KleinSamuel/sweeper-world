import { textures } from "./TextureLoader";

/*
    Represents a single cell within a cell chunk.
    It has a local x and y coordinaten within that chunk.
 */
export default class Cell {

    /*
        Initializes a cell.
        State: {
            isHidden: boolean,
            value: int (0-9),
            user: long (player id)
        }
     */
    constructor(state) {
        this.state = state;

        this.sprite = undefined;
        this.updateSprite()
    }

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
            this.sprite = this.textureLoader.getSprite("num" + this.state.value);
        }
    }

    setState(state) {
        this.state = state;
        this.updateSprite();
    }
}