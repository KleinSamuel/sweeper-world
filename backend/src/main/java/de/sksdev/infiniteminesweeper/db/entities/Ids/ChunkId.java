package de.sksdev.infiniteminesweeper.db.entities.Ids;

import javax.persistence.Embeddable;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class ChunkId implements Serializable, Comparable<ChunkId> {
    @NotNull
    private int x;

    @NotNull
    private int y;

    public ChunkId() {

    }

    public ChunkId(int x, int y) {
        this.x = x;
        this.y = y;
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
        return Objects.hash(x, y);
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
        int x_dist = this.getX() - other.getX();
        if (x_dist == 0) {
            int y_dist = this.getY() - other.getY();
            return y_dist;
//            return y_dist != 0 ? (y_dist > 0 ? 1 : -1) : 0;
        }
        return x_dist;// > 0 ? 1 : -1;
    }
}
