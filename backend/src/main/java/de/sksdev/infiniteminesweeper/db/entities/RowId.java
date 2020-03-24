package de.sksdev.infiniteminesweeper.db.entities;

import java.io.Serializable;

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
}
