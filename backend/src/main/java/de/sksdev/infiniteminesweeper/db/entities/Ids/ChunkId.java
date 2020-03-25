package de.sksdev.infiniteminesweeper.db.entities.Ids;

import javax.persistence.Embeddable;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

@Embeddable
public class ChunkId implements Serializable, Comparable<ChunkId> {
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
        return (x + "_" + y).hashCode();
    }


    @Override
    public String toString() {
        return "ChunkId{" +
                "x=" + x +
                ", y=" + y +
                '}';
    }

    @Override
    public int compareTo(ChunkId other) {
        long x_dist = this.getX() - other.getX();
        if (x_dist == 0) {
            long y_dist = this.getY() - other.getY();
            return y_dist != 0 ? (y_dist > 0 ? 1 : -1) : 0;
        }
        return x_dist > 0 ? 1 : -1;
    }
}
