import * as PIXI from "pixi.js";
import {textures} from "./TextureLoader";
import * as CONFIG from "./Config";

export default class UserInterface extends PIXI.Container {

    constructor(viewer, width, height) {
        super();
        this.viewer = viewer;

        this.addBottomPanel();

        this.addOptionDebug();

        this.addInfoBackground();
        this.addInfoPlayername();
        this.addOptionsButton();
        this.addPosition();

        this.addDesignOptions();

        this.resize(width, height)
    }

    update() {
        this.i_name.n.text = "ID: " + CONFIG.getID();
    }

    resize(width, height) {
        this.screenWidth = width;
        this.screenHeight = height;

        this.bottompanel.position.set(-5, height - this.bottompanel.height + 5);
        this.bottompanel.b.width = width + 10;
        this.bottompanel.c_info.x = width / 2 - 300 / 2 * 3;

        this.infoBackground.x = this.screenWidth - 300;
        this.options.position.set(window.innerWidth / 2 - this.options.width / 2, 200);
        this.design.position.set(window.innerWidth / 2 - this.design.width / 2, 200);
    }

    openOptions() {
        this.options.visible = true;
    }

    closeOptions() {
        this.options.visible = false;
    }

    addInfoBackground() {
        let background = new PIXI.Graphics();
        background.beginFill(CONFIG.COLOR_BG);
        background.lineStyle(2, CONFIG.COLOR_HIGHLIGHT);
        background.drawRect(0, 0, CONFIG.MENU_INFO_WIDTH, CONFIG.MENU_INFO_HEIGHT);
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
            fill: CONFIG.COLOR_HIGHLIGHT
        });

        this.i_name.addChild(this.i_name.n);
        this.infoBackground.addChild(this.i_name);
    }

    addOptionsButton() {
        let context = this;
        this.b_logout = new PIXI.Sprite(textures.button_options);
        this.b_logout.width = 60;
        this.b_logout.height = 30;
        this.b_logout.x = 15;
        this.b_logout.y = 110;
        this.b_logout.interactive = true;
        this.b_logout.on("mousedown", function () {
            context.openOptions();
        });
        this.infoBackground.addChild(this.b_logout);
    }

    addPosition() {
        this.position_x = new PIXI.Text("X:", {
            fontSize: 28,
            fill: CONFIG.COLOR_TEXT
        });
        this.position_x.x = 15;
        this.position_x.y = 45;
        this.position_y = new PIXI.Text("Y:", {
            fontSize: 28,
            fill: CONFIG.COLOR_TEXT
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
        this.options.background.beginFill(CONFIG.COLOR_BG);
        this.options.background.lineStyle(2, CONFIG.COLOR_HIGHLIGHT);
        this.options.background.drawRect(0, 0, width, height);
        this.options.addChildAt(this.options.background, 0);

        this.options.close = new PIXI.Sprite(textures.box_close);
        this.options.close.width = 20;
        this.options.close.height = 20;
        this.options.close.x = width - this.options.close.width - 5;
        this.options.close.y = 5;
        this.options.close.interactive = true;
        this.options.close.on("mousedown", function () {
            context.closeOptions();
        });
        this.options.addChild(this.options.close);

        this.options.header = new PIXI.Text("OPTIONS", {
            fontSize: 28,
            fill: CONFIG.COLOR_HIGHLIGHT,
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
        this.options.sound.button.on("mousedown", function () {
            CONFIG.switchOptionSoundEnabled();
            context.options.sound.button.texture = CONFIG.getOptionSoundEnabled() ? textures.box_checked : textures.box_empty;
        });
        this.options.sound.addChild(this.options.sound.button);

        this.options.sound.text = new PIXI.Text("enable sound", {
            fontSize: 18,
            fill: CONFIG.COLOR_TEXT
        });
        this.options.sound.text.x = width / 2 - left;
        this.options.sound.addChild(this.options.sound.text);

        this.options.addChildAt(this.options.sound, 2);

        // DESIGN
        this.options.design = new PIXI.Sprite(textures.button_design);
        this.options.design.width = 60;
        this.options.design.height = 30;
        this.options.design.x = width / 2 - this.options.design.width / 2;
        this.options.design.y = 150;
        this.options.design.interactive = true;
        this.options.design.on("mousedown", function () {
            context.design.visible = true;
        });
        this.options.addChild(this.options.design);

        // LOGOUT BUTTON
        this.options.logout = new PIXI.Sprite(textures.button_logout);
        this.options.logout.width = 60;
        this.options.logout.height = 30;
        this.options.logout.x = width / 2 - this.options.logout.width / 2;
        this.options.logout.y = height - 40;
        this.options.logout.interactive = true;
        this.options.logout.on("mousedown", function () {
            context.viewer.logout();
        });
        this.options.addChild(this.options.logout);

        this.addChild(this.options);
    }

    addDesignOptions() {

        let context = this;
        let width = 500;
        let height = 500;

        // CONTAINER
        this.design = new PIXI.Container();
        this.design.visible = false;
        this.design.width = width;
        this.design.height = height;
        this.design.interactive = true;
        this.design.position.set(window.innerWidth / 2 - this.design.width / 2, 200);


        // BACKGROUND
        this.design.background = new PIXI.Graphics();
        this.design.background.beginFill(CONFIG.COLOR_BG);
        this.design.background.lineStyle(2, CONFIG.COLOR_HIGHLIGHT);
        this.design.background.drawRect(0, 0, width, height);
        this.design.addChildAt(this.design.background, 0);

        // CLOSE BUTTON
        this.design.close = new PIXI.Sprite(textures.box_close);
        this.design.close.width = 20;
        this.design.close.height = 20;
        this.design.close.x = width - this.design.close.width - 5;
        this.design.close.y = 5;
        this.design.close.interactive = true;
        this.design.close.on("mousedown", function () {
            context.design.visible = false;
        });
        this.design.addChild(this.design.close);


        // HEADER
        this.design.header = new PIXI.Text("DESIGNS", {
            fontSize: 28,
            fill: CONFIG.COLOR_HIGHLIGHT,
            align: "center"
        });
        this.design.header.x = width / 2 - this.design.header.width / 2;
        this.design.header.y = 15;
        this.design.addChildAt(this.design.header, 1);

        // DESIGN OPTIONS
        for (let i = 0; i < CONFIG.DESIGNS.length; i++) {
            let d = CONFIG.DESIGNS[i];
            this.design[d] = new PIXI.Container();
            this.design[d].x = 0;
            this.design[d].y = i * 50 + 100;

            let texture = d === CONFIG.getDesign() ? textures.box_checked : textures.box_empty;

            this.design[d].button = new PIXI.Sprite(texture);
            this.design[d].button.width = 20;
            this.design[d].button.height = 20;
            this.design[d].button.x = 100;
            this.design[d].button.interactive = true;
            this.design[d].button.on("mousedown", function () {
                for (let e of CONFIG.DESIGNS) {
                    context.design[e].button.texture = textures.box_empty;
                }
                CONFIG.setDesign(d);
                context.design[d].button.texture = textures.box_checked;
                context.viewer.updateTextures(d);
            });
            this.design[d].addChild(this.design[d].button);

            this.design[d].text = new PIXI.Text(d, {
                fontSize: 18,
                fill: CONFIG.COLOR_TEXT
            });
            this.design[d].text.x = width / 2 - 100;
            this.design[d].addChild(this.design[d].text);

            this.design.addChild(this.design[d]);
        }

        this.addChild(this.design);
    }

    /*

        0) info about clicked tile
        username of player

        1) player info
        username
        user id
        score

        2) current season stats
        # cells cleared
        # bombs flagged
        # bombs exploded
        # wrong flags

        3) overall stats
        # cells cleared
        # bombs flagged
        # bombs exploded
        # wrong flags

     */
    addBottomPanel() {

        let width = window.innerWidth;
        let height = 150;

        let boxWidth = 300;
        this.boxWidth = 300;
        let boxHeight = 30;

        let colorBack = 0x200f21;
        let colorBox = 0x464159;

        this.bottompanel = new PIXI.Container();
        this.bottompanel.visible = true;
        this.bottompanel.width = width;
        this.bottompanel.height = height;
        this.bottompanel.position.set(0, window.innerHeight - height);

        let b = new PIXI.Graphics();
        b.beginFill(0x000000);
        b.lineStyle(1, 0xffffff);
        b.drawRect(0, 0, width + 1, height);
        this.bottompanel.b = b;
        this.bottompanel.addChild(b);

        let c_info = new PIXI.Container();
        c_info.visible = true;
        c_info.width = boxWidth * 3 + 15;
        c_info.height = height;
        c_info.position.set(width / 2 - boxWidth * 3 / 2, 0);

        c_info.h1 = new PIXI.Graphics();
        c_info.h1.position.set(0, 10);
        c_info.h1.beginFill(0x22272c);
        c_info.h1.drawRect(0, 0, boxWidth, boxHeight / 2);
        c_info.addChild(c_info.h1);
        c_info.h1.t = new PIXI.Text("PLAYER INFO", {fontSize: 10, fill: 0xffffff, align: "center"});
        c_info.h1.t.position.set(5, 2);
        c_info.h1.t.x = boxWidth / 2 - c_info.h1.t.width / 2;
        c_info.h1.addChild(c_info.h1.t);

        c_info.b1 = new PIXI.Graphics();
        c_info.b1.position.set(0, 30);
        c_info.b1.beginFill(0x22272c);
        c_info.b1.drawRect(0, 0, boxWidth, boxHeight);
        c_info.addChild(c_info.b1);
        c_info.b1.t = new PIXI.Text("NAME", {fontSize: 18, fill: 0xffffff});
        c_info.b1.t.position.set(5, 5);
        c_info.b1.addChild(c_info.b1.t);
        c_info.b1.v = new PIXI.Text(CONFIG.getName(), {fontSize: 18, fill: 0xffffff, align: "right"});
        c_info.b1.v.position.set(5, 5);
        c_info.b1.v.x = boxWidth - c_info.b1.v.width - 5;
        c_info.b1.addChild(c_info.b1.v);

        c_info.b2 = new PIXI.Graphics();
        c_info.b2.position.set(0, 30 + boxHeight + 5);
        c_info.b2.beginFill(0x22272c);
        c_info.b2.drawRect(0, 0, boxWidth, boxHeight);
        c_info.addChild(c_info.b2);
        c_info.b2.t = new PIXI.Text("ID", {fontSize: 18, fill: 0xffffff});
        c_info.b2.t.position.set(5, 5);
        c_info.b2.addChild(c_info.b2.t);
        c_info.b2.v = new PIXI.Text(CONFIG.getID(), {fontSize: 18, fill: 0xffffff, align: "right"});
        c_info.b2.v.position.set(5, 5);
        c_info.b2.v.x = boxWidth - c_info.b2.v.width - 5;
        c_info.b2.addChild(c_info.b2.v);

        c_info.b3 = new PIXI.Graphics();
        c_info.b3.position.set(0, 30 + boxHeight * 2 + 10);
        c_info.b3.beginFill(0x22272c);
        c_info.b3.drawRect(0, 0, boxWidth, boxHeight);
        c_info.addChild(c_info.b3);
        c_info.b3.t = new PIXI.Text("CURRENT STREAK", {fontSize: 18, fill: 0xffffff});
        c_info.b3.t.position.set(5, 5);
        c_info.b3.addChild(c_info.b3.t);
        c_info.b3.v = new PIXI.Text("0", {fontSize: 18, fill: 0xffffff, align: "right"});
        c_info.b3.v.position.set(5, 5);
        c_info.b3.v.x = boxWidth - c_info.b3.v.width - 5;
        this.streak = c_info.b3.v;
        c_info.b3.addChild(c_info.b3.v);

        c_info.h2 = new PIXI.Graphics();
        c_info.h2.position.set(boxWidth + 5, 10);
        c_info.h2.beginFill(0x22272c);
        c_info.h2.drawRect(0, 0, boxWidth + 5, boxHeight / 2);
        c_info.addChild(c_info.h2);
        c_info.h2.t = new PIXI.Text("CURRENT SEASON STATS", {fontSize: 10, fill: 0xffffff, align: "center"});
        c_info.h2.t.position.set(5, 2);
        c_info.h2.t.x = boxWidth / 2 - c_info.h2.t.width / 2;
        c_info.h2.addChild(c_info.h2.t);

        c_info.b4 = new PIXI.Graphics();
        c_info.b4.position.set(boxWidth + 5, 30);
        c_info.b4.beginFill(0x22272c);
        c_info.b4.drawRect(0, 0, boxWidth / 2, boxHeight);
        c_info.addChild(c_info.b4);
        c_info.b4.t = new PIXI.Text("CELLS", {fontSize: 18, fill: 0xffffff});
        c_info.b4.t.position.set(5, 5);
        c_info.b4.addChild(c_info.b4.t);
        c_info.b4.v = new PIXI.Text("0", {fontSize: 18, fill: 0xffffff, align: "right"});
        c_info.b4.v.position.set(5, 5);
        c_info.b4.v.x = boxWidth / 2 - c_info.b4.v.width - 5;
        this.currentCellsOpened = c_info.b4.v;
        c_info.b4.addChild(c_info.b4.v);

        c_info.b5 = new PIXI.Graphics();
        c_info.b5.position.set(boxWidth + 5, 30 + boxHeight + 5);
        c_info.b5.beginFill(0x22272c);
        c_info.b5.drawRect(0, 0, boxWidth / 2, boxHeight);
        c_info.addChild(c_info.b5);
        c_info.b5.t = new PIXI.Text("BOMBS", {fontSize: 18, fill: 0xffffff});
        c_info.b5.t.position.set(5, 5);
        c_info.b5.addChild(c_info.b5.t);
        c_info.b5.v = new PIXI.Text("0", {fontSize: 18, fill: 0xffffff, align: "right"});
        c_info.b5.v.position.set(5, 5);
        c_info.b5.v.x = boxWidth / 2 - c_info.b5.v.width - 5;
        this.currentBombsExploded = c_info.b5.v;
        c_info.b5.addChild(c_info.b5.v);

        c_info.b6 = new PIXI.Graphics();
        c_info.b6.position.set(boxWidth + 10 + boxWidth / 2, 30);
        c_info.b6.beginFill(0x22272c);
        c_info.b6.drawRect(0, 0, boxWidth / 2, boxHeight);
        c_info.addChild(c_info.b6);
        c_info.b6.t = new PIXI.Text("FLAGS", {fontSize: 18, fill: 0xffffff});
        c_info.b6.t.position.set(5, 5);
        c_info.b6.addChild(c_info.b6.t);
        c_info.b6.v = new PIXI.Text("0", {fontSize: 18, fill: 0xffffff, align: "right"});
        c_info.b6.v.position.set(5, 5);
        c_info.b6.v.x = boxWidth / 2 - c_info.b6.v.width - 5;
        this.currentFlagsSet = c_info.b6.v;
        c_info.b6.addChild(c_info.b6.v);

        c_info.b7 = new PIXI.Graphics();
        c_info.b7.position.set(boxWidth + 10 + boxWidth / 2, 30 + boxHeight + 5);
        c_info.b7.beginFill(0x22272c);
        c_info.b7.drawRect(0, 0, boxWidth / 2, boxHeight);
        c_info.addChild(c_info.b7);
        c_info.b7.t = new PIXI.Text("STREAK", {fontSize: 18, fill: 0xffffff});
        c_info.b7.t.position.set(5, 5);
        c_info.b7.addChild(c_info.b7.t);
        c_info.b7.v = new PIXI.Text("0", {fontSize: 18, fill: 0xffffff, align: "right"});
        c_info.b7.v.position.set(5, 5);
        c_info.b7.v.x = boxWidth / 2 - c_info.b7.v.width - 5;
        this.currentStreak = c_info.b7.v;
        c_info.b7.addChild(c_info.b7.v);

        c_info.b8 = new PIXI.Graphics();
        c_info.b8.position.set(boxWidth + 5, 30 + boxHeight * 2 + 10);
        c_info.b8.beginFill(0x22272c);
        c_info.b8.drawRect(0, 0, boxWidth + 5, boxHeight);
        c_info.addChild(c_info.b8);
        c_info.b8.t = new PIXI.Text("SCORE", {fontSize: 18, fill: 0xffffff});
        c_info.b8.t.position.set(5, 5);
        c_info.b8.addChild(c_info.b8.t);
        c_info.b8.v = new PIXI.Text("0", {fontSize: 18, fill: 0xffffff, align: "right"});
        c_info.b8.v.position.set(5, 5);
        c_info.b8.v.x = boxWidth - c_info.b8.v.width;
        this.currentScore = c_info.b8.v;
        c_info.b8.addChild(c_info.b8.v);

        c_info.h3 = new PIXI.Graphics();
        c_info.h3.position.set(boxWidth * 2 + 15, 10);
        c_info.h3.beginFill(0x22272c);
        c_info.h3.drawRect(0, 0, boxWidth + 5, boxHeight / 2);
        c_info.addChild(c_info.h3);
        c_info.h3.t = new PIXI.Text("TOTAL STATS", {fontSize: 10, fill: 0xffffff, align: "center"});
        c_info.h3.t.position.set(5, 2);
        c_info.h3.t.x = boxWidth / 2 - c_info.h3.t.width / 2;
        c_info.h3.addChild(c_info.h3.t);

        c_info.b9 = new PIXI.Graphics();
        c_info.b9.position.set(boxWidth * 2 + 15, 30);
        c_info.b9.beginFill(0x22272c);
        c_info.b9.drawRect(0, 0, boxWidth / 2, boxHeight);
        c_info.addChild(c_info.b9);
        c_info.b9.t = new PIXI.Text("CELLS", {fontSize: 18, fill: 0xffffff});
        c_info.b9.t.position.set(5, 5);
        c_info.b9.addChild(c_info.b9.t);
        c_info.b9.v = new PIXI.Text("0", {fontSize: 18, fill: 0xffffff, align: "right"});
        c_info.b9.v.position.set(5, 5);
        c_info.b9.v.x = boxWidth / 2 - c_info.b9.v.width - 5;
        this.totalCellsOpened = c_info.b9.v;
        c_info.b9.addChild(c_info.b9.v);

        c_info.b10 = new PIXI.Graphics();
        c_info.b10.position.set(boxWidth * 2 + 15, 30 + boxHeight + 5);
        c_info.b10.beginFill(0x22272c);
        c_info.b10.drawRect(0, 0, boxWidth / 2, boxHeight);
        c_info.addChild(c_info.b10);
        c_info.b10.t = new PIXI.Text("BOMBS", {fontSize: 18, fill: 0xffffff});
        c_info.b10.t.position.set(5, 5);
        c_info.b10.addChild(c_info.b10.t);
        c_info.b10.v = new PIXI.Text("0", {fontSize: 18, fill: 0xffffff, align: "right"});
        c_info.b10.v.position.set(5, 5);
        c_info.b10.v.x = boxWidth / 2 - c_info.b10.v.width - 5;
        this.totalBombsExploded = c_info.b10.v;
        c_info.b10.addChild(c_info.b10.v);

        c_info.b11 = new PIXI.Graphics();
        c_info.b11.position.set(boxWidth * 2 + 20 + boxWidth / 2, 30);
        c_info.b11.beginFill(0x22272c);
        c_info.b11.drawRect(0, 0, boxWidth / 2, boxHeight);
        c_info.addChild(c_info.b11);
        c_info.b11.t = new PIXI.Text("FLAGS", {fontSize: 18, fill: 0xffffff});
        c_info.b11.t.position.set(5, 5);
        c_info.b11.addChild(c_info.b11.t);
        c_info.b11.v = new PIXI.Text("0", {fontSize: 18, fill: 0xffffff, align: "right"});
        c_info.b11.v.position.set(5, 5);
        c_info.b11.v.x = boxWidth / 2 - c_info.b11.v.width - 5;
        this.totalFlagsSet = c_info.b11.v;
        c_info.b11.addChild(c_info.b11.v);

        c_info.b12 = new PIXI.Graphics();
        c_info.b12.position.set(boxWidth * 2 + 20 + boxWidth / 2, 30 + boxHeight + 5);
        c_info.b12.beginFill(0x22272c);
        c_info.b12.drawRect(0, 0, boxWidth / 2, boxHeight);
        c_info.addChild(c_info.b12);
        c_info.b12.t = new PIXI.Text("STREAK", {fontSize: 18, fill: 0xffffff});
        c_info.b12.t.position.set(5, 5);
        c_info.b12.addChild(c_info.b12.t);
        c_info.b12.v = new PIXI.Text("0", {fontSize: 18, fill: 0xffffff, align: "right"});
        c_info.b12.v.position.set(5, 5);
        c_info.b12.v.x = boxWidth / 2 - c_info.b12.v.width - 5;
        this.totalStreak = c_info.b12.v;
        c_info.b12.addChild(c_info.b12.v);

        c_info.b13 = new PIXI.Graphics();
        c_info.b13.position.set(boxWidth * 2 + 15, 30 + boxHeight * 2 + 10);
        c_info.b13.beginFill(0x22272c);
        c_info.b13.drawRect(0, 0, boxWidth + 5, boxHeight);
        c_info.addChild(c_info.b13);
        c_info.b13.t = new PIXI.Text("SCORE", {fontSize: 18, fill: 0xffffff});
        c_info.b13.t.position.set(5, 5);
        c_info.b13.addChild(c_info.b13.t);
        c_info.b13.v = new PIXI.Text("0", {fontSize: 18, fill: 0xffffff, align: "right"});
        c_info.b13.v.position.set(5, 5);
        c_info.b13.v.x = boxWidth - c_info.b13.v.width;
        this.totalScore = c_info.b13.v;
        c_info.b13.addChild(c_info.b13.v);

        this.bottompanel.c_info = c_info;
        this.bottompanel.addChild(c_info);

        this.addChild(this.bottompanel);
    }
}