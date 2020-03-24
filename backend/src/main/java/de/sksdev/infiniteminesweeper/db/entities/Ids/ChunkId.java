package de.sksdev.infiniteminesweeper.db.entities.Ids;

import javax.persistence.Embeddable;
import java.io.Serializable;

@Embeddable
public class ChunkId implements Serializable {
    private long x;
    private long y;

    public ChunkId() {

    }

    public ChunkId(long x, long y) {

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
}
