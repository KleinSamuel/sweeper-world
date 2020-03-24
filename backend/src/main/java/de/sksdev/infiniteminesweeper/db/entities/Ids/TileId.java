package de.sksdev.infiniteminesweeper.db.entities.Ids;

import javax.persistence.Embeddable;
import java.io.Serializable;

@Embeddable
public class TileId implements Serializable {
    private long x;
    private long y;
    private int x_tile;
    private int y_tile;

    public TileId(){
    }

    public TileId(long x, long y, int x_tile, int y_tile) {
        this.x = x;
        this.y = y;
        this.x_tile = x_tile;
        this.y_tile=y_tile;
    }

    public long getX() {
        return x;
    }

    public void setX(long x) {
        this.x = x;
    }

    public long getY() {
        return y;
    }

    public void setY(long y) {
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
}
