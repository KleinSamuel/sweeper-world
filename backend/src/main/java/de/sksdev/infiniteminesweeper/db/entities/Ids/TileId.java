package de.sksdev.infiniteminesweeper.db.entities.Ids;

import java.io.Serializable;

public class TileId implements Serializable {
    private long x;
    private long y;
    private int x_tile;
    private int y_tile;

    public TileId(long x, long y, int x_tile, int y_tile) {
        this.x = x;
        this.y = y;
        this.x_tile=x_tile;
        this.y_tile=y_tile;
    }

    public TileId(){
    }
}
