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

        /*
        context.posText = new PIXI.Text("", {
            fontSize: 20,
            fill: 0xffffff,
            align: "center"
        });
        context.posText.y = cursor.y - 4*CONFIG.CELL_PIXEL_SIZE;
        context.cursor.addChild(context.posText);
        */

        this.addChild(this.sprite);
    }
}