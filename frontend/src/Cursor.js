import * as PIXI from "pixi.js";
import {textures} from "./TextureLoader";
import * as CONFIG from "./Config";

export default class Cursor extends PIXI.Container {

    constructor() {
        super();
        this.initCursor();
    }

    setDebugText(chunkX, chunkY, x, y, value, hidden, user) {
        this.posText.text = "chunk " + chunkX + ":" + chunkY +
            "\ncell " + x + ":" + y +
            "\nvalue: " + value +
            "\nopen: " + !hidden +
            "\nplayer: " + user;
        this.posText.visible = true;
    }

    disableDebugText() {
        this.posText.visible = false;
    }

    initCursor() {
        this.sprite = new PIXI.Sprite(textures.cursor);
        this.sprite.width = CONFIG.CELL_PIXEL_SIZE;
        this.sprite.height = CONFIG.CELL_PIXEL_SIZE;
        this.addChild(this.sprite);

        this.posText = new PIXI.Text("", {
            fontSize: 20,
            fill: 0xffffff,
            align: "center"
        });
        this.posText.y = this.y - 4*CONFIG.CELL_PIXEL_SIZE;
        this.posText.visible = false;
        this.addChild(this.posText);
    }
}