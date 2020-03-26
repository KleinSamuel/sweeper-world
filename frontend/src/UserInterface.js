import * as PIXI from "pixi.js";
import {textures} from "./TextureLoader";
import * as CONFIG from "./Config";

export default class UserInterface extends PIXI.Container {

    constructor(width, height) {
        super();
        this.is_debug = false;

        this.addOptionBackground();
        this.addOptionDebug();

        this.addInfoBackground();

        this.resize(width, height)
    }

    resize(width, height) {
        this.screenWidth = width;
        this.screenHeight = height;
        this.infoBackground.x = this.screenWidth - 300;
    }

    addOptionBackground () {
        let background = new PIXI.Graphics();
        background.beginFill(0x200f21);
        background.lineStyle(2, 0x54123b);
        background.drawRect(0,0,200,50);
        background.interactive = true;
        background.buttonMode = true;
        this.optionBackground = background;
        this.addChildAt(this.optionBackground, 0)
    }

    addInfoBackground() {
        let background = new PIXI.Graphics();
        background.beginFill(0x200f21);
        background.lineStyle(2, 0x54123b);
        background.drawRect(0,0, 300, 151);
        background.interactive = true;
        background.buttonMode = true;
        background.y = -2;
        this.infoBackground = background;
        this.addChildAt(this.infoBackground, 0)
    }

    updateBoxDebug() {
        this.o_debug.box.texture = this.is_debug ? textures.box_checked : textures.box_empty;
    }

    addOptionDebug() {
        let context = this;
        this.o_debug = new PIXI.Container();
        this.o_debug.x = 15;
        this.o_debug.y = 15;

        this.o_debug.box = new PIXI.Sprite();
        this.o_debug.box.width = CONFIG.CELL_PIXEL_SIZE * 0.75;
        this.o_debug.box.height = CONFIG.CELL_PIXEL_SIZE * 0.75;
        this.o_debug.box.interactive = true;
        this.o_debug.box.on("mousedown", function(){
            context.is_debug = !context.is_debug;
            context.updateBoxDebug();
        });
        this.o_debug.addChild(this.o_debug.box);

        this.o_debug.text = new PIXI.Text("debug mode", {
            fontSize: 18,
            fill: 0xd12bea
        });
        this.o_debug.text.x = CONFIG.CELL_PIXEL_SIZE * 1.5;
        this.o_debug.addChild(this.o_debug.text);

        this.updateBoxDebug();
        this.addChild(this.o_debug);
    }
}