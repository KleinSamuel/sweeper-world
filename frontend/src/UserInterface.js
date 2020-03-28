import * as PIXI from "pixi.js";
import {textures} from "./TextureLoader";
import * as CONFIG from "./Config";

export default class UserInterface extends PIXI.Container {

    constructor(main, width, height) {
        super();
        this.main = main;

        this.addOptionDebug();

        this.addInfoBackground();
        this.addInfoPlayername();
        this.addOptionsButton();
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
        this.options.position.set(window.innerWidth / 2 - this.options.width / 2, 200);
    }

    openOptions() {
        this.options.visible = true;
    }
    closeOptions() {
        this.options.visible = false;
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
        this.i_name.y = 15;

        this.i_name.n = new PIXI.Text("ID: unknown", {
            fontSize: 28,
            fill: 0xd12bea
        });

        this.i_name.addChild(this.i_name.n);
        this.infoBackground.addChild(this.i_name);
    }

    addOptionsButton() {
        let context = this;
        this.b_logout = new PIXI.Sprite(textures.button_logout);
        this.b_logout.width = 60;
        this.b_logout.height = 30;
        this.b_logout.x = 15;
        this.b_logout.y = 110;
        this.b_logout.interactive = true;
        this.b_logout.on("mousedown", function() {
            context.openOptions();
        });
        this.infoBackground.addChild(this.b_logout);
    }

    addPosition() {
        this.position_x = new PIXI.Text("X:", {
            fontSize: 28,
            fill: 0xd12bea
        });
        this.position_x.x = 15;
        this.position_x.y = 45;
        this.position_y = new PIXI.Text("Y:", {
            fontSize: 28,
            fill: 0xd12bea
        });
        this.position_y.x = 15;
        this.position_y.y = 70;
        this.infoBackground.addChild(this.position_x);
        this.infoBackground.addChild(this.position_y);
    }

    addOptionDebug() {

        let context = this;

        let width = 500;
        let height = 500;

        // options container
        this.options = new PIXI.Container();
        this.options.visible = false;
        this.options.width = width;
        this.options.height = height;
        this.options.position.set(window.innerWidth / 2 - this.options.width / 2, 200);
        // options background
        this.options.background = new PIXI.Graphics();
        this.options.background.beginFill(0x200f21);
        this.options.background.lineStyle(2, 0x54123b);
        this.options.background.drawRect(0,0, width, height);
        this.options.background.interactive = true;
        this.options.background.buttonMode = true;
        this.options.addChildAt(this.options.background, 0);

        this.options.close = new PIXI.Sprite(textures.box_empty);
        this.options.close.width = 20;
        this.options.close.height = 20;
        this.options.close.x = width - this.options.close.width - 5;
        this.options.close.y = 5;
        this.options.close.interactive = true;
        this.options.close.on("mousedown", function() {
            context.closeOptions();
        });
        this.options.addChild(this.options.close);

        this.options.header = new PIXI.Text("OPTIONS", {
            fontSize: 28,
            fill: 0xd12bea,
            align: "center"
        });
        this.options.header.x = width / 2 - this.options.header.width / 2;
        this.options.header.y = 15;
        this.options.addChildAt(this.options.header, 1);

        let left = 100;

        this.options.sound = new PIXI.Container();
        this.options.sound.width = width;
        this.options.sound.height = 100;
        this.options.sound.y = 100;

        this.options.sound.button = new PIXI.Sprite(textures.box_checked);
        this.options.sound.button.width = 20;
        this.options.sound.button.height = 20;
        this.options.sound.button.x = left;
        this.options.sound.button.interactive = true;
        this.options.sound.button.on("mousedown", function() {
            CONFIG.switchOptionSoundEnabled();
            context.options.sound.button.texture = CONFIG.getOptionSoundEnabled() ? textures.box_checked : textures.box_empty;
        });
        this.options.sound.addChild(this.options.sound.button);

        this.options.sound.text = new PIXI.Text("enable sound", {
            fontSize: 18,
            fill: 0xd12bea
        });
        this.options.sound.text.x = width / 2 - left;
        this.options.sound.addChild(this.options.sound.text);

        this.options.addChildAt(this.options.sound, 2);

        // DESIGN
        this.options.design = new PIXI.Sprite(textures.button_logout);
        this.options.design.width = 60;
        this.options.design.height = 30;
        this.options.design.x = width / 2 - this.options.design.width / 2;
        this.options.design.y = 150;
        this.options.design.interactive = true;
        this.options.design.on("mousedown", function() {

        });
        this.options.addChild(this.options.design);

        // LOGOUT BUTTON
        this.options.logout = new PIXI.Sprite(textures.button_logout);
        this.options.logout.width = 60;
        this.options.logout.height = 30;
        this.options.logout.x = width / 2 - this.options.logout.width / 2;
        this.options.logout.y = height - 40;
        this.options.logout.interactive = true;
        this.options.logout.on("mousedown", function() {
            context.main.logout();
        });
        this.options.addChild(this.options.logout);

        this.addChild(this.options);
    }
}