import * as PIXI from "pixi.js";
import * as CONFIG from "./Config";

export let loader = undefined;

export let textures = null;

export function init() {
    console.log("[ INFO ] TextureLoader initialized");
    return preloadTextures().then(function(resources){
        textures = {
            cursor: resources.cursor.texture,
            box_empty: resources.box_empty.texture,
            box_checked: resources.box_checked.texture,
            button_logout: resources.button_logout.texture,
        };
    }).then(function() {
        return updateCellDesign(CONFIG.getDesign());
    }).catch(function(err){
        console.log(err);
    });
}

export function updateCellDesign(designname) {
    return setCellDesign(designname).then(function(resources) {
        textures["closed"] = resources["closed"].texture;
        textures["open"] = resources["open"].texture;
        textures["flag"] = resources["flag"].texture;
        textures["mine"] = resources["mine"].texture;
        textures["num1"] = resources["num1"].texture;
        textures["num2"] = resources["num2"].texture;
        textures["num3"] = resources["num3"].texture;
        textures["num4"] = resources["num4"].texture;
        textures["num5"] = resources["num5"].texture;
        textures["num6"] = resources["num6"].texture;
        textures["num7"] = resources["num7"].texture;
        textures["num8"] = resources["num8"].texture;
        return textures;
    });
}

function setCellDesign(designname) {

    let closed = CONFIG.URL_ASSETS+"/designs/"+designname+"/closed.png";
    let open = CONFIG.URL_ASSETS+"/designs/"+designname+"/open.png";
    let flag = CONFIG.URL_ASSETS+"/designs/"+designname+"/flag.png";
    let mine = CONFIG.URL_ASSETS+"/designs/"+designname+"/mine.png";
    let num1 = CONFIG.URL_ASSETS+"/designs/"+designname+"/num1.png";
    let num2 = CONFIG.URL_ASSETS+"/designs/"+designname+"/num2.png";
    let num3 = CONFIG.URL_ASSETS+"/designs/"+designname+"/num3.png";
    let num4 = CONFIG.URL_ASSETS+"/designs/"+designname+"/num4.png";
    let num5 = CONFIG.URL_ASSETS+"/designs/"+designname+"/num5.png";
    let num6 = CONFIG.URL_ASSETS+"/designs/"+designname+"/num6.png";
    let num7 = CONFIG.URL_ASSETS+"/designs/"+designname+"/num7.png";
    let num8 = CONFIG.URL_ASSETS+"/designs/"+designname+"/num8.png";

    return new Promise(function(resolve, reject) {
        loader
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
            .load(function(loader, resources) {
                resolve(resources)
            });
    });
}

function preloadTextures() {
    return new Promise(function(resolve, reject){
        loader = new PIXI.Loader();
        loader.reset()
            .add("cursor", CONFIG.URL_ASSETS+"/images/cursor.png")
            .add("box_empty", CONFIG.URL_ASSETS+"/images/box_empty.png")
            .add("box_checked", CONFIG.URL_ASSETS+"/images/box_checked.png")
            .add("button_logout", CONFIG.URL_ASSETS+"/images/button_logout.png")
            .load(function(loader, resources){
                resolve(resources);
            });
    });
}