import * as PIXI from "pixi.js";
import * as Textures from "./TextureLoader";
import {textures} from "./TextureLoader";
import MinefieldModel from "./MinefieldModel";
import Communicator from "./Communicator";

export default class MinefieldViewer {

    constructor(minefieldModel) {
        console.log("MinefieldViewer started");

        this.SIZE = 30;
        this.CHUNK_AMOUNT = 32;
        this.CHUNK_SIZE = this.CHUNK_AMOUNT * this.SIZE;
        this.GLOBAL_POS_X = 0;
        this.GLOBAL_POS_Y = 0;

        let context = this;
        Textures.init().then(function() {
            context.com = new Communicator();
            context.minefieldModel = new MinefieldModel(0, 0);
            return context.initApplication();
        }).then(function(app){
            context.app = app;
            context.field = new PIXI.Container();

            context.cursor = new PIXI.Container();
            let cursor = new PIXI.Sprite(textures.cursor);
            cursor.width = context.SIZE;
            cursor.height = context.SIZE;
            context.cursor.addChild(cursor);

            context.app.stage.addChildAt(context.field, 0);
            context.app.stage.addChildAt(context.cursor, 1);
            context.updateField();
        });
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
                    let chunkOffsetX = (context.field.x > 0) ? (context.field.x % context.CHUNK_SIZE) : context.CHUNK_SIZE + (context.field.x % context.CHUNK_SIZE);
                    let chunkOffsetY = (context.field.y > 0) ? (context.field.y % context.CHUNK_SIZE) : context.CHUNK_SIZE + (context.field.y % context.CHUNK_SIZE);

                    // calculates the chunk relative to the screen
                    let tmpChunkX = ~~((context.cursor.x+(context.CHUNK_SIZE-chunkOffsetX)) / context.CHUNK_SIZE);
                    let tmpChunkY = ~~((context.cursor.y+(context.CHUNK_SIZE-chunkOffsetY)) / context.CHUNK_SIZE);
                    // calculates the global coordinates of the chunk the mouse is in
                    let chunkX = context.GLOBAL_POS_X + tmpChunkX;
                    let chunkY = context.GLOBAL_POS_Y + tmpChunkY;

                    // calculates the cell relative in the respective chunk
                    let cellOffsetX = ~~(chunkOffsetX / context.SIZE) % context.CHUNK_AMOUNT;
                    let cellOffsetY = ~~(chunkOffsetY / context.SIZE) % context.CHUNK_AMOUNT;
                    let cellX = (context.cursor.tmpX - cellOffsetX) % context.CHUNK_AMOUNT;
                    cellX = (cellX < 0) ? context.CHUNK_AMOUNT + cellX : cellX;
                    let cellY = (context.cursor.tmpY - cellOffsetY) % context.CHUNK_AMOUNT;
                    cellY = (cellY < 0) ? context.CHUNK_AMOUNT + cellY : cellY;

                    if (event.button === 0) {
                        context.minefieldModel.clickCell(chunkX, chunkY, cellX, cellY);
                        context.updateField();
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

                    if (Math.abs(lastX - x) > context.SIZE || Math.abs(lastY - y) > context.SIZE) {
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
                    context.GLOBAL_POS_X = ~~(fX / context.CHUNK_SIZE) + ((fX < 0) ? -1 : 0);
                    let fY = context.field.y*-1;
                    context.GLOBAL_POS_Y = ~~(fY / context.CHUNK_SIZE) + ((fY < 0) ? -1 : 0);
                    context.minefieldModel.chunkX = context.GLOBAL_POS_X;
                    context.minefieldModel.chunkY = context.GLOBAL_POS_Y;

                    // loads the next chunks
                    let movedX = context.GLOBAL_POS_X - oldGlobalX;
                    if (movedX !== 0) {
                        context.minefieldModel.moveX(movedX);
                        context.updateField();
                    }

                    let movedY = context.GLOBAL_POS_Y - oldGlobalY;
                    if (movedY !== 0) {
                        context.minefieldModel.moveY(movedY);
                        context.updateField();
                    }

                }
                // used to compute the position of the field
                tmpX = x;
                tmpY = y;

                // calculates the position of the cursor regarding the field offset
                let offsetX = (context.field.x % context.SIZE);
                let offsetY = (context.field.y % context.SIZE);
                let cX = context.computeCursorCellCoordinate(x, offsetX);
                let cY = context.computeCursorCellCoordinate(y, offsetY);
                let dX = context.SIZE * cX + offsetX;
                let dY = context.SIZE * cY + offsetY;

                // moves the cursor
                context.cursor.x = dX;
                context.cursor.y = dY;
                // adds the auxiliary cell coordinates to the cursor object
                context.cursor.tmpX = (offsetX < 0) ? cX - 1 : cX;
                context.cursor.tmpY = (offsetY < 0) ? cY - 1 : cY;

            });

            window.addEventListener("contextmenu", function(event){
                // TODO: add when deploying so user can set flags
                //event.preventDefault();
            });

            resolve(app);
        });
    }

    computeCursorCellCoordinate(screen, offset) {
        return ~~((screen-offset) / this.SIZE);
    }

    updateField() {

        this.field.removeChildren();

        for (let chunkX in this.minefieldModel.field) {
            for (let chunkY in this.minefieldModel.field[chunkX]) {

                let chunk = this.minefieldModel.getChunk(chunkX, chunkY);

                for (let x = 0; x < chunk.innerField.length; x++) {
                    for (let y = 0; y < chunk.innerField[x].length; y++) {

                        let cell = chunk.innerField[x][y];
                        let cellSprite = cell.sprite;
                        this.field.addChild(cellSprite);

                        cellSprite.width = this.SIZE;
                        cellSprite.height = this.SIZE;
                        cellSprite.x = chunkX * this.CHUNK_SIZE + x * this.SIZE;
                        cellSprite.y = chunkY * this.CHUNK_SIZE + y * this.SIZE;
                    }
                }
            }
        }

    }

}

