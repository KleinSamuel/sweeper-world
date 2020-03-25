import * as CONFIG from "./Config";
import * as PIXI from "pixi.js";
import * as Textures from "./TextureLoader";
import {textures} from "./TextureLoader";
import MinefieldModel from "./MinefieldModel";
import Communicator from "./Communicator";
import { Howl } from "howler";

export default class MinefieldViewer {

    constructor() {

        this.GLOBAL_POS_X = 0;
        this.GLOBAL_POS_Y = 0;

        let userID = 1;

        let context = this;
        Textures.init().then(function() {
            return new Promise(function(resolve, reject){
                context.com = new Communicator(userID);
                context.minefieldModel = new MinefieldModel(userID, context.com, context.GLOBAL_POS_X, context.GLOBAL_POS_X);
                context.minefieldModel.init().then(function () {
                    return context.initApplication();
                }).then(resolve);
            });
        }).then(function(app){
            context.app = app;
            context.field = new PIXI.Container();

            context.cursor = new PIXI.Container();
            let cursor = new PIXI.Sprite(textures.cursor);
            cursor.width = CONFIG.CELL_PIXEL_SIZE;
            cursor.height = CONFIG.CELL_PIXEL_SIZE;

            context.cursor.addChild(cursor);

            context.app.stage.addChildAt(context.field, 0);
            context.app.stage.addChildAt(context.cursor, 1);

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

            context.updateField();
        });
    }

    initApplication() {

        let context = this;

        return new Promise(function(resolve, reject) {
            let app = new PIXI.Application({
                    width: 256,
                    height: 256,
                    antialias: true,
                    transparent: false,
                    resolution: 1
                }
            );

            document.body.appendChild(app.view);

            app.renderer.resize(window.innerWidth, window.innerHeight);

            window.addEventListener("resize", function(){
                app.renderer.resize(window.innerWidth, window.innerHeight);
            });

            let isMouseDown = false;
            let isDragged = false;
            let lastX = 0;
            let lastY = 0;
            let tmpX = 0;
            let tmpY = 0;
            let currentX = 0;
            let currentY = 0;

            window.addEventListener("mousedown", function(event){
                isMouseDown = true;
            });

            window.addEventListener("mouseup", function(event){
                isMouseDown = false;
                if (isDragged) {
                    isDragged = false;
                    lastX = currentX;
                    lastY = currentY;
                } else {

                    // offset of how much of the leftmost chunk is visible
                    let chunkOffsetX = (context.field.x > 0) ? (context.field.x % CONFIG.CHUNK_PIXEL_SIZE) : CONFIG.CHUNK_PIXEL_SIZE + (context.field.x % CONFIG.CHUNK_PIXEL_SIZE);
                    let chunkOffsetY = (context.field.y > 0) ? (context.field.y % CONFIG.CHUNK_PIXEL_SIZE) : CONFIG.CHUNK_PIXEL_SIZE + (context.field.y % CONFIG.CHUNK_PIXEL_SIZE);

                    // calculates the chunk relative to the screen
                    let tmpChunkX = ~~((context.cursor.x+(CONFIG.CHUNK_PIXEL_SIZE-chunkOffsetX)) / CONFIG.CHUNK_PIXEL_SIZE);
                    let tmpChunkY = ~~((context.cursor.y+(CONFIG.CHUNK_PIXEL_SIZE-chunkOffsetY)) / CONFIG.CHUNK_PIXEL_SIZE);
                    // calculates the global coordinates of the chunk the mouse is in
                    let chunkX = context.GLOBAL_POS_X + tmpChunkX;
                    let chunkY = context.GLOBAL_POS_Y + tmpChunkY;

                    // calculates the cell relative in the respective chunk
                    let cellOffsetX = ~~(chunkOffsetX / CONFIG.CELL_PIXEL_SIZE) % CONFIG.CHUNK_SIZE;
                    let cellOffsetY = ~~(chunkOffsetY / CONFIG.CELL_PIXEL_SIZE) % CONFIG.CHUNK_SIZE;
                    let cellX = (context.cursor.tmpX - cellOffsetX) % CONFIG.CHUNK_SIZE;
                    cellX = (cellX < 0) ? CONFIG.CHUNK_SIZE + cellX : cellX;
                    let cellY = (context.cursor.tmpY - cellOffsetY) % CONFIG.CHUNK_SIZE;
                    cellY = (cellY < 0) ? CONFIG.CHUNK_SIZE + cellY : cellY;

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
                }
            });

            window.addEventListener("mousemove", function(event){

                let x = event.clientX;
                let y = event.clientY;

                if(isMouseDown) {

                    if (Math.abs(lastX - x) > CONFIG.CELL_PIXEL_SIZE || Math.abs(lastY - y) > CONFIG.CELL_PIXEL_SIZE) {
                        currentX = x;
                        currentY = y;
                        isDragged = true;
                    }

                    // moves the field
                    context.field.x = context.field.x - (tmpX - x);
                    context.field.y = context.field.y - (tmpY - y);

                    let oldGlobalX = context.GLOBAL_POS_X;
                    let oldGlobalY = context.GLOBAL_POS_Y;

                    let fX = context.field.x*-1;
                    context.GLOBAL_POS_X = ~~(fX / CONFIG.CHUNK_PIXEL_SIZE) + ((fX < 0) ? -1 : 0);
                    let fY = context.field.y*-1;
                    context.GLOBAL_POS_Y = ~~(fY / CONFIG.CHUNK_PIXEL_SIZE) + ((fY < 0) ? -1 : 0);
                    context.minefieldModel.chunkX = context.GLOBAL_POS_X;
                    context.minefieldModel.chunkY = context.GLOBAL_POS_Y;

                    // loads the next chunks
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
                // used to compute the position of the field
                tmpX = x;
                tmpY = y;

                // calculates the position of the cursor regarding the field offset
                let offsetX = (context.field.x % CONFIG.CELL_PIXEL_SIZE);
                let offsetY = (context.field.y % CONFIG.CELL_PIXEL_SIZE);
                let cX = context.computeCursorCellCoordinate(x, offsetX);
                let cY = context.computeCursorCellCoordinate(y, offsetY);
                let dX = CONFIG.CELL_PIXEL_SIZE * cX + offsetX;
                let dY = CONFIG.CELL_PIXEL_SIZE * cY + offsetY;

                // moves the cursor
                context.cursor.x = dX;
                context.cursor.y = dY;
                // adds the auxiliary cell coordinates to the cursor object
                context.cursor.tmpX = (offsetX < 0) ? cX - 1 : cX;
                context.cursor.tmpY = (offsetY < 0) ? cY - 1 : cY;

            });

            window.addEventListener("contextmenu", function(event){
                // TODO: add when deploying so user can set flags
                event.preventDefault();
            });

            resolve(app);
        });
    }

    computeCursorCellCoordinate(screen, offset) {
        return ~~((screen-offset) / CONFIG.CELL_PIXEL_SIZE);
    }

    updateField() {

        this.field.removeChildren();

        for (let chunkX in this.minefieldModel.field) {
            for (let chunkY in this.minefieldModel.field[chunkX]) {

                // does not draw chunks that are outside of the drawing buffer
                if (Math.abs(this.GLOBAL_POS_X - chunkX) > CONFIG.BUFFER_ADD) {
                    continue;
                }
                if (Math.abs(this.GLOBAL_POS_Y - chunkY) > CONFIG.BUFFER_ADD) {
                    continue;
                }

                let chunk = this.minefieldModel.getChunk(chunkX, chunkY);

                for (let x = 0; x < chunk.innerField.length; x++) {
                    for (let y = 0; y < chunk.innerField[x].length; y++) {

                        let cell = chunk.innerField[x][y];

                        let cellSprite = cell.sprite;
                        this.field.addChild(cellSprite);

                        cellSprite.width = CONFIG.CELL_PIXEL_SIZE;
                        cellSprite.height = CONFIG.CELL_PIXEL_SIZE;
                        cellSprite.x = chunkX * CONFIG.CHUNK_PIXEL_SIZE + x * CONFIG.CELL_PIXEL_SIZE;
                        cellSprite.y = chunkY * CONFIG.CHUNK_PIXEL_SIZE + y * CONFIG.CELL_PIXEL_SIZE;
                    }
                }
            }
        }

    }

}

