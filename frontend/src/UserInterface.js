import * as PIXI from "pixi.js";
import {textures} from "./TextureLoader";
import * as CONFIG from "./Config";

export default class UserInterface extends PIXI.Container {

    constructor(main, width, height) {
        super();
        this.main = main;

        this.is_debug = false;

        this.addOptionBackground();
        this.addOptionDebug();

        this.addInfoBackground();
        this.addInfoPlayername();
        this.addLogoutButton();
        this.addPosition();

        this.resize(width, height)
    }

    update() {
        this.i_name.n.text = "ID: "+CONFIG.getID();
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

    addInfoPlayername() {
        this.i_name = new PIXI.Container();
        this.i_name.x = 15;
        this.i_name.y = 50;

        this.i_name.n = new PIXI.Text("ID: unknown", {
            fontSize: 18,
            fill: 0xd12bea
        });

        this.i_name.addChild(this.i_name.n);
        this.infoBackground.addChild(this.i_name);
    }

    addLogoutButton() {
        let context = this;
        this.b_logout = new PIXI.Sprite(textures.button_logout);
        this.b_logout.width = 60;
        this.b_logout.height = 30;
        this.b_logout.x = 15;
        this.b_logout.y = 110;
        this.b_logout.interactive = true;
        this.b_logout.on("mousedown", function() {
            CONFIG.setID(-1);
            context.main.logout();
        });
        this.infoBackground.addChild(this.b_logout);
    }

    addPosition() {
        this.position_x = new PIXI.Text("X: 123123", {
            fontSize: 18,
            fill: 0xd12bea
        });
        this.position_x.x = 15;
        this.position_x.y = 15;
        this.position_y = new PIXI.Text("Y: 0989798", {
            fontSize: 18,
            fill: 0xd12bea
        });
        this.position_y.x = 15;
        this.position_y.y = 30;
        this.infoBackground.addChild(this.position_x);
        this.infoBackground.addChild(this.position_y);
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