import { Howl } from "howler";
import * as CONFIG from "./Config";

let pipeline;

export let sounds = null;

export function init() {
    if(!pipeline) {
        sounds = {};
        pipeline = preloadTextures();
    }
    return pipeline;
}

export function play(name) {
    if (CONFIG.getOptionSoundEnabled()) {
        sounds[name].play(undefined, false);
    }
}

function preloadTextures() {
    return new Promise(function(resolve, reject){
        sounds.click_no = new Howl({
            src: "assets/click_sound_no.mp3"
        });
        sounds.click_error = new Howl({
            src: "assets/click_sound_error.mp3"
        });
        sounds.click_cell = new Howl({
            src: "assets/click_sound_cell.mp3"
        });
        sounds.click_flag = new Howl({
            src: "assets/click_sound_flag.mp3"
        });
        sounds.explosion = new Howl({
            src: "assets/explosion.mp3"
        });
        resolve();
    });
}