/**
 * Contains all configuration variables.
 *
 * @author Samuel Klein
 */

/* URL of the server */
export const URL_API = "http://localhost:8090/backend";
/* number of cells in a cell chunk */
export const CHUNK_SIZE = 32;
/* size of a single cell in pixel */
export const CELL_PIXEL_SIZE = 30;
/* size of a chunk in pixel */
export const CHUNK_PIXEL_SIZE = CHUNK_SIZE * CELL_PIXEL_SIZE;
/* amount of chunks that are preloaded around the current position */
export const BUFFER_ADD = 2;
/* distance of chunks after which they are removed from the buffer */
export const BUFFER_REMOVE = 2;