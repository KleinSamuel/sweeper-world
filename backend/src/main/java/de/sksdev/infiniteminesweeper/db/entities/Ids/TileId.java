package de.sksdev.infiniteminesweeper.db.entities.Ids;

import java.io.Serializable;

public class TileId implements Serializable {
    private int x;
    private int y;
    private int x_tile;
    private int y_tile;

    public TileId(int x, int y, int x_tile, int y_tile) {
        this.x = x;
        this.y = y;
        this.x_tile = x_tile;
        this.y_tile = y_tile;
    }

    public TileId() {
    }

    public int getX() {
        return x;
    }

    public void setX(int x) {
        this.x = x;
    }

    public int getY() {
        return y;
    }

    public void setY(int y) {
        this.y = y;
    }

    public int getX_tile() {
        return x_tile;
    }

    public void setX_tile(int x_tile) {
        this.x_tile = x_tile;
    }

    public int getY_tile() {
        return y_tile;
    }

    public void setY_tile(int y_tile) {
        this.y_tile = y_tile;
    }

    public ChunkId getChunkId() {
        return new ChunkId(getX(), getY());
    }
}
