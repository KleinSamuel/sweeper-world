import Cookies from "js-cookie";

/**
 * Contains all configuration variables.
 *
 * @author Samuel Klein
 */

/* URL of the server */
export const URL_API = HOST_BACKEND+"/backend";
export const URL_ASSETS = HOST_ASSETS+"/assets";

export const DESIGNS = [
    "default", "neon", "template", "blackwhite"
];

/* number of cells in a cell chunk */
export const CHUNK_SIZE = 32;
/* size of a single cell in pixel */
export const CELL_PIXEL_SIZE = 50;
/* size of a chunk in pixel */
export const CHUNK_PIXEL_SIZE = CHUNK_SIZE * CELL_PIXEL_SIZE;
/* amount of chunks that are preloaded around the current position */
export const BUFFER_ADD = 1;
/* distance of chunks after which they are removed from the buffer */
export const BUFFER_REMOVE = 2;

export const MENU_INFO_WIDTH = 300;
export const MENU_INFO_HEIGHT = 151;

let ENABLED_SOUND = true;
export function getOptionSoundEnabled() {
    return ENABLED_SOUND;
}
export function switchOptionSoundEnabled() {
    ENABLED_SOUND = !ENABLED_SOUND;
}

let USER_ID = -1;
let USER_HASH = "";
let DESIGN = "default";

// TODO: implement cookie check
if (document.cookie) {
    USER_ID = parseInt(Cookies.get("id"));
    USER_HASH = Cookies.get("hash");
    DESIGN = Cookies.get("design");
}
export function logout() {
    USER_ID = -1;
    USER_HASH = "";
    Cookies.remove("id");
    Cookies.remove("hash");
    Cookies.remove("design");
}

export function getID() {
    return USER_ID;
}
export function setID(id) {
    USER_ID = id;
    Cookies.set("id", id);
}
export function getHash() {
    return USER_HASH;
}
export function setHash(hash) {
    USER_HASH = hash;
    Cookies.set("hash", hash);
}
export function getDesign() {
    return DESIGN;
}
export function setDesign(name) {
    if (!name in DESIGNS) {
        return;
    }
    DESIGN = name;
    Cookies.set("design", name);
}