package de.sksdev.infiniteminesweeper.db.entities.Ids;

import javax.persistence.Embeddable;
import java.io.Serializable;

@Embeddable
public class RowId implements Serializable {
    private long x;
    private long y;
    private int y_tile;

    public RowId() {

    }

    public RowId(long x, long y) {
        this.x = x;
        this.y = y;
    }

    public RowId(long x, long y, int y_tile) {
        this.x = x;
        this.y = y;
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

    public int getY_tile() {
        return y_tile;
    }

    public void setY_tile(int y_tile) {
        this.y_tile = y_tile;
    }
}
