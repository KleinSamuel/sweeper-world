/*
    Represents a single cell within a cell chunk.
    It has a local x and y coordinaten within that chunk.
 */
export default class Cell {

    /*
        Initializes a cell.
        State: {
            isHidden: boolean,
            value: int (0-9),
            player: long (player id)
        }
     */
    constructor(x, y, state) {
        this.x = x;
        this.y = y;
        this.state = state;
    }

    getSpriteName() {
        if (this.state.isHidden && !this.state.player) {
            return "closed";
        }
        if (this.state.isHidden && this.state.player) {
            return "flagged";
        }
        if (this.state.value === 0) {
            return "empty";
        }
        if (this.state.value === 9) {
            return "bomb";
        }
        return ""+this.state.value;
    }

    toString() {
        if (this.state.isHidden && !this.state.player) {
            return "o";
        }
        if (this.state.isHidden && this.state.player) {
            return "F";
        }
        if (this.state.value === 0) {
            return " ";
        }
        if (this.state.value === 9) {
            return "x";
        }
        return this.state.value;
    }
}