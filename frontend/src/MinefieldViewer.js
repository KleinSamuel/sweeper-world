import * as CONFIG from "./Config";
import * as PIXI from "pixi.js";
import * as Textures from "./TextureLoader";
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

            context.minefieldModel = new MinefieldModel(context.com, context.GLOBAL_POS_X, context.GLOBAL_POS_X);

            context.minefieldModel.init().then(resolve);
        });
    }

    createField() {

        let context = this;

        context.ui = new UserInterface(this, window.innerWidth, window.innerHeight);
        context.ui.update();

        context.field = new PIXI.Container();

        context.cursor = new Cursor();

        context.app.stage.addChildAt(context.field, 0);
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
            fieldX = context.field.x;
            fieldY = context.field.y;
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
                    context.field.x = fieldX - distX;
                    context.field.y = fieldY - distY;
                    context.cursor.sprite.visible = false;

                    // computes the chunk x and y coordinates of the main chunk in focus
                    let oldGlobalX = context.GLOBAL_POS_X;
                    let oldGlobalY = context.GLOBAL_POS_Y;

                    let fX = context.field.x * -1;
                    context.GLOBAL_POS_X = ~~(fX / CONFIG.CHUNK_PIXEL_SIZE) + ((fX < 0) ? -1 : 0);
                    let fY = context.field.y * -1;
                    context.GLOBAL_POS_Y = ~~(fY / CONFIG.CHUNK_PIXEL_SIZE) + ((fY < 0) ? -1 : 0);

                    context.minefieldModel.chunkX = context.GLOBAL_POS_X;
                    context.minefieldModel.chunkY = context.GLOBAL_POS_Y;

                    // loads the next chunks if player moved out of buffer
                    let movedX = context.GLOBAL_POS_X - oldGlobalX;
                    if (movedX !== 0) {
                        context.minefieldModel.moveX(movedX).then(function(){
                            context.updateField();
                        });
                    }
                    let movedY = context.GLOBAL_POS_Y - oldGlobalY;
                    if (movedY !== 0) {
                        context.minefieldModel.moveY(movedY).then(function(){
                            context.updateField();
                        });
                    }
                }
            }

        });

        window.addEventListener("contextmenu", function(event){
            // disables the default behavior of the right mouse button click
            event.preventDefault();
        });

        context.initField();
    }

    logout() {
        // TODO: this is onyl an ugly fix to destroy all current entities on logout
        location.reload();
    }

    initField() {

        console.log("init field!");

        let context = this;

        context.displayed = {};

        for (let chunkX in context.minefieldModel.field) {

            if (!(chunkX in context.displayed)) {
                context.displayed[chunkX] = {};
            }

            for (let chunkY in context.minefieldModel.field[chunkX]) {

                let chunk = context.minefieldModel.field[chunkX][chunkY];

                context.displayed[chunkX][chunkY] = new PIXI.Container();

                for (let x = 0; x < chunk.innerField.length; x++) {
                    for (let y = 0; y < chunk.innerField[x].length; y++) {

                        let cell = chunk.innerField[x][y];

                        let cellSprite = cell.sprite;
                        cellSprite.on("mouseover", function(){
                            context.cursor.x = context.field.x + chunkX * CONFIG.CHUNK_PIXEL_SIZE + this.x;
                            context.cursor.y = context.field.y + chunkY * CONFIG.CHUNK_PIXEL_SIZE + this.y;
                            if (context.ui.is_debug) {
                                context.cursor.setDebugText(chunkX, chunkY, x, y, cell.state.value, cell.state.hidden, cell.state.user);
                            } else {
                                context.cursor.disableDebugText();
                            }
                        });
                        cellSprite.position.set(x * CONFIG.CELL_PIXEL_SIZE, y * CONFIG.CELL_PIXEL_SIZE);
                        cellSprite.width = CONFIG.CELL_PIXEL_SIZE;
                        cellSprite.height = CONFIG.CELL_PIXEL_SIZE;
                        context.displayed[chunkX][chunkY].addChild(cellSprite);
                    }
                }

                context.displayed[chunkX][chunkY].position.set(chunkX * CONFIG.CHUNK_PIXEL_SIZE, chunkY * CONFIG.CHUNK_PIXEL_SIZE);
                this.field.addChild(context.displayed[""+chunkX][chunkY]);
            }
        }

        let count = 0;
        for (let chunkX in context.displayed) {
            count += Object.keys(context.displayed[chunkX]).length;
        }
        console.log("size displayed: "+count);
    }

    updateField() {

        console.log("update field");

        let context = this;

        for (let chunkX in this.minefieldModel.field) {

            // removes all chunks out of view container that are too far away on x axis
            if (Math.abs(chunkX - context.GLOBAL_POS_X) > CONFIG.BUFFER_ADD) {
                delete context.displayed[chunkX];
                continue;
            }

            // adds a new x layer if not present as all chunks here are in buffer range
            if (!(chunkX in context.displayed)) {
                context.displayed[chunkX] = {};
            }

            for (let chunkY in this.minefieldModel.field[chunkX]) {

                // removes all chunks out of view container that are too far away on y axis
                if (Math.abs(chunkY - context.GLOBAL_POS_Y) > CONFIG.BUFFER_ADD) {
                    delete context.displayed[chunkX][chunkY];
                    continue;
                }
                // skips as the chunk is already drawn
                if (chunkX in context.displayed[chunkX]) {
                    continue;
                }

                let chunk = this.minefieldModel.field[chunkX][chunkY];

                context.displayed[chunkX][chunkY] = new PIXI.Container();

                for (let x = 0; x < chunk.innerField.length; x++) {
                    for (let y = 0; y < chunk.innerField[x].length; y++) {

                        let cell = chunk.innerField[x][y];

                        let cellSprite = cell.sprite;
                        cellSprite.on("mouseover", function(){
                            context.cursor.x = context.field.x + chunkX * CONFIG.CHUNK_PIXEL_SIZE + this.x;
                            context.cursor.y = context.field.y + chunkY * CONFIG.CHUNK_PIXEL_SIZE + this.y;
                            if (context.ui.is_debug) {
                                context.cursor.setDebugText(chunkX, chunkY, x, y, cell.state.value, cell.state.hidden, cell.state.user);
                            } else {
                                context.cursor.disableDebugText();
                            }
                        });
                        cellSprite.position.set(x * CONFIG.CELL_PIXEL_SIZE, y * CONFIG.CELL_PIXEL_SIZE);
                        cellSprite.width = CONFIG.CELL_PIXEL_SIZE;
                        cellSprite.height = CONFIG.CELL_PIXEL_SIZE;
                        context.displayed[chunkX][chunkY].addChild(cellSprite);

                    }
                }

                context.displayed[chunkX][chunkY].position.set(chunkX * CONFIG.CHUNK_PIXEL_SIZE, chunkY * CONFIG.CHUNK_PIXEL_SIZE);
                this.field.addChild(context.displayed[chunkX][chunkY]);
            }
        }

        let count = 0;
        for (let chunkX in context.displayed) {
            count += Object.keys(context.displayed[chunkX]).length;
        }
        console.log("size displayed: "+count);
        count = 0;
        for (let chunkX in context.minefieldModel.field) {
            count += Object.keys(context.minefieldModel.field[chunkX]).length;
        }
        console.log("cached: "+count);

    }

}

