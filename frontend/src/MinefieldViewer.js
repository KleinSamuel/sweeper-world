import * as CONFIG from "./Config";
import * as PIXI from "pixi.js";
import * as Textures from "./TextureLoader";
import * as Sounds from "./Sounds";
import StartScreen from "./StartScreen";
import Cursor from "./Cursor";
import UserInterface from "./UserInterface";
import MinefieldModel from "./MinefieldModel";
import Communicator from "./Communicator";
import { Howl } from "howler";

export default class MinefieldViewer {

    constructor() {

        console.log("web gl? "+PIXI.utils.isWebGLSupported());

        this.GLOBAL_POS_X = 0;
        this.GLOBAL_POS_Y = 0;

        let context = this;

        context.com = new Communicator();

        context.startscreen = new StartScreen(context.initialize.bind(context));

        if (CONFIG.getID() === -1) {
            context.startscreen.show();
            return;
        }

        this.initialize();
    }

    initialize() {
        Textures.init()
            .then(Sounds.init)
            .then(this.initApplication.bind(this))
            .then(this.createField.bind(this));
    }

    initApplication() {
        let context = this;

        return new Promise(function(resolve, reject) {
            let app = new PIXI.Application({
                    width: 256,
                    height: 256,
                    antialias: false,
                    transparent: false,
                    resolution: 1
                }
            );
            document.body.appendChild(app.view);
            console.log("[ INFO ] View Application initialized");

            context.app = app;
            context.app.renderer.resize(window.innerWidth, window.innerHeight);

            context.minefieldModel = new MinefieldModel(context.com, context.GLOBAL_POS_X, context.GLOBAL_POS_Y);
            context.minefieldModel.init().then(resolve);
        });
    }

    createField() {

        let context = this;

        context.ui = new UserInterface(this, window.innerWidth, window.innerHeight);
        context.ui.update();

        context.cursor = new Cursor();

        context.app.stage.addChildAt(context.minefieldModel, 0);
        context.app.stage.addChildAt(context.cursor, 1);
        context.app.stage.addChildAt(context.ui, 2);
        context.app.stage.addChildAt(context.startscreen, 3);

        const explosionTextures = [];
        let i;

        for (i = 0; i < 26; i++) {
            const texture = PIXI.Texture.from(`Explosion_Sequence_A ${i + 1}.png`);
            explosionTextures.push(texture);
        }

        const explosion = new PIXI.AnimatedSprite(explosionTextures);
        explosion.x = 100;
        explosion.y = 100;
        explosion.anchor.set(0.5);
        explosion.scale.set(1);
        //explosion.gotoAndPlay(1);
        explosion.visible = false;
        explosion.loop = false;
        context.app.stage.addChild(explosion);
        context.exp = explosion;

        context.exp_sound = new Howl({
            src: "assets/explosion.mp3"
        });

        window.addEventListener("resize", function(){
            context.app.renderer.resize(window.innerWidth, window.innerHeight);
            context.ui.resize(window.innerWidth, window.innerHeight);
        });

        let fieldX = -1;
        let fieldY = -1;
        let mouseDownX = -1;
        let mouseDownY = -1;

        window.addEventListener("mousedown", function(event){
            mouseDownX = event.clientX;
            mouseDownY = event.clientY;
            fieldX = context.minefieldModel.x;
            fieldY = context.minefieldModel.y;
        });

        window.addEventListener("mouseup", function(event){

            context.cursor.sprite.visible = true;

            mouseDownX = -1;
            mouseDownY = -1;
            fieldX = -1;
            fieldY = -1;
            /*
            event.button = 3;
            if (event.button === 0) {
                let code = context.minefieldModel.clickCell(chunkX, chunkY, cellX, cellY);
                context.updateField();
                if (code === 1) {
                    context.exp.visible = true;
                    context.exp.animationSpeed = 0.5;
                    context.exp.x = context.cursor.x + CONFIG.CELL_PIXEL_SIZE/2;
                    context.exp.y = context.cursor.y + CONFIG.CELL_PIXEL_SIZE/2;
                    context.exp.gotoAndPlay(1);
                    context.exp_sound.play();
                }
            } else if (event.button === 2) {
                context.minefieldModel.flagCell(chunkX, chunkY, cellX, cellY);
                context.updateField();
            }
            */
        });

        window.addEventListener("mousemove", function(event){

            // true if mouse button is down
            if (mouseDownX !== -1 && mouseDownY !== -1) {
                // calculates the distance from the origin when the mouse was pressed
                let distX = mouseDownX - event.clientX;
                let distY = mouseDownY - event.clientY;
                // if the distance is greater than one cell move the entire field
                if (Math.abs(distX) > CONFIG.CELL_PIXEL_SIZE || Math.abs(distY) > CONFIG.CELL_PIXEL_SIZE) {
                    context.minefieldModel.position.set(fieldX - distX, fieldY - distY);

                    context.cursor.sprite.visible = false;

                    // computes the chunk x and y coordinates of the main chunk in focus
                    let oldGlobalX = context.GLOBAL_POS_X;
                    let oldGlobalY = context.GLOBAL_POS_Y;

                    let fX = context.minefieldModel.x * -1;
                    context.GLOBAL_POS_X = ~~(fX / CONFIG.CHUNK_PIXEL_SIZE) + ((fX < 0) ? -1 : 0);
                    let fY = context.minefieldModel.y * -1;
                    context.GLOBAL_POS_Y = ~~(fY / CONFIG.CHUNK_PIXEL_SIZE) + ((fY < 0) ? -1 : 0);

                    context.minefieldModel.chunkX = context.GLOBAL_POS_X;
                    context.minefieldModel.chunkY = context.GLOBAL_POS_Y;

                    // loads the next chunks if player moved out of buffer
                    let movedX = context.GLOBAL_POS_X - oldGlobalX;
                    if (movedX !== 0) {
                        context.minefieldModel.moveX(movedX).then(function(){
                            context.updateVisible();
                        });
                    }
                    let movedY = context.GLOBAL_POS_Y - oldGlobalY;
                    if (movedY !== 0) {
                        context.minefieldModel.moveY(movedY).then(function(){
                            context.updateVisible();
                        });
                    }
                }
            }

        });

        window.addEventListener("contextmenu", function(event){
            // disables the default behavior of the right mouse button click
            event.preventDefault();
        });

        context.updateVisible();
    }

    logout() {
        // TODO: this is onyl an ugly fix to destroy all current entities on logout
        location.reload();
    }

    updateVisible() {
        let xMin = this.GLOBAL_POS_X - 1;
        let xMax = this.GLOBAL_POS_X + ~~((this.GLOBAL_POS_X + window.innerWidth) / CONFIG.CHUNK_PIXEL_SIZE + 1);
        let yMin = this.GLOBAL_POS_Y - 1;
        let yMax = this.GLOBAL_POS_Y + ~~((this.GLOBAL_POS_Y + window.innerHeight) / CONFIG.CHUNK_PIXEL_SIZE + 1);

        for (let chunkX in this.minefieldModel.field) {
            for (let chunkY in this.minefieldModel.field[chunkX]) {
                if (chunkX < xMin || chunkX > xMax || chunkY < yMin || chunkY > yMax) {
                    this.minefieldModel.field[chunkX][chunkY].visible = false;
                    continue;
                }
                this.minefieldModel.field[chunkX][chunkY].visible = true;
            }
        }
    }

}

