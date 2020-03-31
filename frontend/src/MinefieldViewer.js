import * as CONFIG from "./Config";
import * as PIXI from "pixi.js";
import * as Textures from "./TextureLoader";
import * as Sounds from "./Sounds";
import StartScreen from "./StartScreen";
import Cursor from "./Cursor";
import UserInterface from "./UserInterface";
import MinefieldModel from "./MinefieldModel";
import Communicator from "./Communicator";

export default class MinefieldViewer {

    constructor() {

        this.GLOBAL_POS_X = 0;
        this.GLOBAL_POS_Y = 0;

        let context = this;

        context.com = new Communicator();

        context.com.initClient().then(function() {

            context.startscreen = new StartScreen(
                context.loginUser.bind(context),
                context.registerUser.bind(context),
                context.loginGuest.bind(context));

            if (CONFIG.getID() === -1) {
                context.startscreen.show();
                return;
            }

            context.com.receiveStatUpdates(context.updateStats.bind(context));

            context.initialize();
        });
    }

    registerUser(username, password, email) {
        let context = this;
        return context.com.registerUser(username, password, email)
            .then(function(response) {
                if (response.data.length === 0) {
                    //TODO display username already been taken message
                    console.error("Username may already been taken!");
                    return null;
                }
                return context.loginUser(username, password);
            }).catch(function(err) {
                console.log("error while registering user");
                console.log(err);
            });
    }

    loginUser(username, password) {
        let context = this;
        return context.com.loginUser(username, password)
            .then(function(response) {

                if(!response) {
                    return;
                }

                CONFIG.setID(response.data.id);
                CONFIG.setHash(response.data.hash);
                CONFIG.setDesign(response.data.userSettings.design);
                CONFIG.setSoundsEnabled(response.data.userSettings.soundsEnabled);

                CONFIG.setStats(response.data.userStats);

                context.com.receiveStatUpdates(context.updateStats.bind(context));
                context.startscreen.hide();
                context.initialize();
            }).catch(function(err) {
                console.log("error while loggin in user");
                console.log(err);
            });
    }

    loginGuest() {
        let context = this;
        return context.com.loginGuest()
            .then(function(response) {
                CONFIG.setID(response.data.id);
                CONFIG.setHash(response.data.hash);
                CONFIG.setDesign(response.data.userSettings.design);
                CONFIG.setSoundsEnabled(response.data.userSettings.soundsEnabled);

                CONFIG.setStats(response.data.userStats);

                context.com.receiveStatUpdates(context.updateStats.bind(context));
                context.startscreen.hide();
                context.initialize();
            }).catch(function (err) {
                console.log(err);
            });
    }

    updateStats(body) {

        this.ui.streak.text = body.streak ? body.streak : "0";
        this.ui.streak.x = this.ui.boxWidth - this.ui.streak.width - 5;

        this.ui.currentCellsOpened.text = body.currentCellsOpened ? body.currentCellsOpened : "0";
        this.ui.currentCellsOpened.x = this.ui.boxWidth / 2 - this.ui.currentCellsOpened.width - 5;

        this.ui.currentFlagsSet.text = body.currentFlagsSet ? body.currentFlagsSet : "0";
        this.ui.currentFlagsSet.x = this.ui.boxWidth / 2 - this.ui.currentFlagsSet.width - 5;

        this.ui.currentBombsExploded.text = body.currentBombsExploded ? body.currentBombsExploded : "0";
        this.ui.currentBombsExploded.x = this.ui.boxWidth / 2 - this.ui.currentBombsExploded.width - 5;

        this.ui.currentStreak.text = body.currentLongestStreak ? body.currentLongestStreak : "0";
        this.ui.currentStreak.x = this.ui.boxWidth / 2 - this.ui.currentStreak.width - 5;

        this.ui.totalScore.text = body.totalScore ? body.totalScore : "0";
        this.ui.totalScore.x = this.ui.boxWidth / 2 - this.ui.totalScore.width - 5;

        this.ui.totalCellsOpened.text = body.totalCellsOpened ? body.totalCellsOpened : "0";
        this.ui.totalCellsOpened.x = this.ui.boxWidth / 2 - this.ui.totalCellsOpened.width - 5;

        this.ui.totalFlagsSet.text = body.totalFlagsSet ? body.totalFlagsSet : "0";
        this.ui.totalFlagsSet.x = this.ui.boxWidth / 2 - this.ui.totalFlagsSet.width - 5;

        this.ui.totalBombsExploded.text = body.totalBombsExploded ? body.totalBombsExploded : "0";
        this.ui.totalBombsExploded.x = this.ui.boxWidth / 2 - this.ui.totalBombsExploded.width - 5;

        this.ui.totalStreak.text = body.totalLongestStreak ? body.totalLongestStreak : "0";
        this.ui.totalStreak.x = this.ui.boxWidth / 2 - this.ui.totalStreak.width - 5;

        this.ui.totalScore.text = body.totalScore ? body.totalScore : "0";
        this.ui.totalScore.x = this.ui.boxWidth / 2 - this.ui.totalScore.width - 5;
    }

    initialize() {
        let context = this;
        Textures.init()
            .then(Sounds.init)
            .then(this.initApplication.bind(this))
            .then(this.createField.bind(this))
            .then(function() {
                return context.com.getStats().then(function(response) {
                    context.updateStats(response.data);
                });
            });
    }

    initApplication() {
        let context = this;

        return new Promise(function (resolve, reject) {
            let bg = 0x000000;
            if (CONFIG.getDesign() === "neon")
                bg = 0x1e1e22;
            let app = new PIXI.Application({
                    width: 256,
                    height: 256,
                    antialias: false,
                    transparent: false,
                    resolution: 1,
                    backgroundColor: bg
                }
            );
            document.body.appendChild(app.view);
            console.log("[ INFO ] View Application initialized");

            context.app = app;
            context.app.renderer.resize(window.innerWidth, window.innerHeight);

            context.minefieldModel = new MinefieldModel(context, context.com, context.GLOBAL_POS_X, context.GLOBAL_POS_Y);
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

        /*
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
        */

        window.addEventListener("resize", function () {
            context.app.renderer.resize(window.innerWidth, window.innerHeight);
            context.ui.resize(window.innerWidth, window.innerHeight);
        });

        // helper variables for the tracking if the field is being dragged
        let fieldX = -1;
        let fieldY = -1;
        let mouseDownX = -1;
        let mouseDownY = -1;

        window.addEventListener("mousedown", function (event) {
            mouseDownX = event.clientX;
            mouseDownY = event.clientY;
            fieldX = context.minefieldModel.x;
            fieldY = context.minefieldModel.y;
        });

        window.addEventListener("mouseup", function (event) {
            context.cursor.sprite.visible = true;
            mouseDownX = -1;
            mouseDownY = -1;
            fieldX = -1;
            fieldY = -1;
        });

        window.addEventListener("mousemove", function (event) {

            // disables field dragging
            if (context.denyInteractions()) {
                return;
            }

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
                        context.minefieldModel.moveX(movedX).then(function () {
                            context.updateVisible();
                        });
                    }
                    let movedY = context.GLOBAL_POS_Y - oldGlobalY;
                    if (movedY !== 0) {
                        context.minefieldModel.moveY(movedY).then(function () {
                            context.updateVisible();
                        });
                    }
                }
            }

        });

        window.addEventListener("contextmenu", function (event) {
            // disables the default behavior of the right mouse button click
            event.preventDefault();
        });

        context.updateVisible();
    }

    updateTextures(name) {
        CONFIG.setDesign(name);
        this.com.updateSettings(CONFIG.getDesign(), CONFIG.getOptionSoundEnabled()).then(function () {
            location.reload();
        });
    }

    denyInteractions() {
        // TODO: add more options that should disable user interactions
        if (this.ui.options.visible) {
            return true;
        }
        return false;
    }

    logout() {
        this.com.logout().then(function () {
            CONFIG.logout();
            // TODO: this is only an ugly fix to destroy all current entities on logout
            location.reload();
        });
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

