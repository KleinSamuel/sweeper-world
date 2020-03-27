import * as PIXI from "pixi.js";

import cursor from "./assets/cursor.png";
import closed from "./assets/closed.png";
import open from "./assets/open.png";
import mine from "./assets/mine_red.png";
import flag from "./assets/flag.png";
import num1 from "./assets/1.png";
import num2 from "./assets/2.png";
import num3 from "./assets/3.png";
import num4 from "./assets/4.png";
import num5 from "./assets/5.png";
import num6 from "./assets/6.png";
import num7 from "./assets/7.png";
import num8 from "./assets/8.png";

import box_empty from "./assets/box_empty.png";
import box_checked from "./assets/box_checked.png";
import button_logout from "./assets/button_logout.png";

import explosionSound from "./assets/explosion.mp3";
import click_flag from "./assets/click_sound_no.mp3";
import click_cell from "./assets/click_sound_cell.mp3";

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
                mine: resources.mine.texture,
                num1: resources.num1.texture,
                num2: resources.num2.texture,
                num3: resources.num3.texture,
                num4: resources.num4.texture,
                num5: resources.num5.texture,
                num6: resources.num6.texture,
                num7: resources.num7.texture,
                num8: resources.num7.texture,
                num9: resources.num7.texture,
                box_empty: resources.box_empty.texture,
                box_checked: resources.box_checked.texture,
                button_logout: resources.button_logout.texture,
            };
            return textures;
        }).catch(function(err){
            console.log(err);
        });
    }
    console.log("[ INFO ] TextureLoader initialized");
    return pipeline;
}

function preloadTextures() {
    return new Promise(function(resolve, reject){
        PIXI.Loader.shared
            .add("cursor", cursor)
            .add("closed", closed)
            .add("open", open)
            .add("flag", flag)
            .add("mine", mine)
            .add("num1", num1)
            .add("num2", num2)
            .add("num3", num3)
            .add("num4", num4)
            .add("num5", num5)
            .add("num6", num6)
            .add("num7", num7)
            .add("num8", num8)
            .add("box_empty", box_empty)
            .add("box_checked", box_checked)
            .add("assets/mc.json")
            .add("button_logout", button_logout)
            .add("explosion", explosionSound)
            .add("click_flag", click_flag)
            .add("click_cell", click_cell)
            .load(function(loader, resources){
                resolve(resources);
            });
    });
}