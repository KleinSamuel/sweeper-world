/**
 * Contains all configuration variables.
 *
 * @author Samuel Klein
 */

/* URL of the server */
export const URL_API = HOST_BACKEND+"/backend";
export const URL_ASSETS = HOST_ASSETS+"/assets";

export const DESIGNS = [
    "default", "neon", "template"
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

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

// TODO: implement cookie check
if (document.cookie) {
    console.log(document.cookie);
    USER_ID = parseInt(getCookie("id"));
    USER_HASH = getCookie("hash");
    DESIGN = getCookie("design");
}
export function logout() {
    USER_ID = -1;
    USER_HASH = "";
    document.cookie = "";
}

export function getID() {
    return USER_ID;
}
export function setID(id) {
    USER_ID = id;
    document.cookie = "id="+id;
}
export function getHash() {
    return USER_HASH;
}
export function setHash(hash) {
    USER_HASH = hash;
    document.cookie = "hash="+hash;
}
export function getDesign() {
    return DESIGN;
}
export function setDesign(name) {
    if (!name in DESIGNS) {
        return;
    }
    DESIGN = name;
    document.cookie = "design="+name;
}