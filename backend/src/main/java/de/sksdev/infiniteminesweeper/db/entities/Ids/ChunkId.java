package de.sksdev.infiniteminesweeper.db.entities.Ids;

import javax.persistence.Embeddable;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

@Embeddable
public class ChunkId implements Serializable {
    @NotNull
    private long x;

    @NotNull
    private long y;

    public ChunkId() {

    }

    public ChunkId(long x, long y) {
        this.x = x;
        this.y = y;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ChunkId chunkId = (ChunkId) o;
        return x == chunkId.x &&
                y == chunkId.y;
    }

    @Override
    public int hashCode() {
        return (x+"_"+y).hashCode();
    }


    @Override
    public String toString() {
        return "ChunkId{" +
                "x=" + x +
                ", y=" + y +
                '}';
    }
}
