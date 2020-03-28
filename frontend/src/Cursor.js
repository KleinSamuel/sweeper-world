import * as PIXI from "pixi.js";
import {textures} from "./TextureLoader";
import * as CONFIG from "./Config";

export default class Cursor extends PIXI.Container {

    constructor() {
        super();
        this.initCursor();
    }

    initCursor() {
        this.sprite = new PIXI.Sprite(textures.cursor);
        this.sprite.width = CONFIG.CELL_PIXEL_SIZE;
        this.sprite.height = CONFIG.CELL_PIXEL_SIZE;
        this.addChild(this.sprite);
    }
}