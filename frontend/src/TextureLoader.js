import * as PIXI from "pixi.js";

import cursor from "./assets/cursor.png";
import closed from "./assets/closed.png";
import open from "./assets/open.png";
import mine from "./assets/mine.png";
import flag from "./assets/flag.png";

let pipeline;

export let textures = null;

export function init() {
    if(!pipeline) {
        pipeline = preloadTextures().then(function(resources){
            textures = {
                cursor: resources.cursor.texture,
                closed: resources.closed.texture,
                open: resources.open.texture,
                flag: resources.flag.texture,
                mine: resources.mine.texture
            };
            return textures;
        }).catch(function(err){
            console.log(err);
        });
    }
    return pipeline;
}

function preloadTextures() {
    return new Promise(function(resolve, reject){
        PIXI.loader
            .add("cursor", cursor)
            .add("closed", closed)
            .add("open", open)
            .add("flag", flag)
            .add("mine", mine)
            .load(function(loader, resources){
                resolve(resources);
            });
    });
}