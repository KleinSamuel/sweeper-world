import * as PIXI from "pixi.js";

import cursor from "./assets/cursor.png";
import closed from "./assets/closed.png";

/*
    Handles all textures.
 */
export default class TextureLoader {

    constructor() {
        console.log("TextureLoader started")
    }

    initialLoad() {
        return new Promise(function(resolve, reject){
            PIXI.loader
                .add("closed", closed)
                .add("cursor", cursor)
                .load(resolve);
        });
    }

    getSprite(name) {
        return new PIXI.Sprite(PIXI.loader.resources[name].texture);
    }
}