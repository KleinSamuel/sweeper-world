package de.sksdev.infiniteminesweeper.db.entities;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import de.sksdev.infiniteminesweeper.Config;
import de.sksdev.infiniteminesweeper.db.entities.Ids.ChunkId;

import javax.persistence.*;
import java.io.Serializable;
import java.util.*;


@Entity
@Table(name = "chunks")
public class Chunk implements Serializable {


    public Chunk() {
    }

    public Chunk(long x, long y) {
        this(new ChunkId(x, y));
    }

    public Chunk(ChunkId id) {
        setId(id);
        initTiles();
    }

    @EmbeddedId
    private ChunkId id;

    @Column
    @JsonIgnore
    private boolean filled = false;

    @OneToMany(mappedBy = "chunk", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<Tile> tiles;

    @Transient
    @JsonIgnore
    private Tile[][] grid;


    public long getX() {
        return this.id.getX();
    }

    public void setX(long x) {
        this.id.setX(x);
    }

    public long getY() {
        return this.id.getY();
    }

    public void setY(long y) {
        this.id.setY(y);
    }

    private void setValues(int[][] values) {
        getTiles().forEach(t -> t.setValue(values[t.getY_tile()][t.getX_tile()]));
    }

    @JsonGetter("tiles")
    public Object getTilesJson() {
        HashMap<Integer, HashMap<Integer, Tile>> out = new HashMap<>();
        for (int i = 0; i < Config.CHUNK_SIZE; i++)
            out.put(i, new HashMap<>());

        tiles.forEach(t -> out.get(t.getX_tile()).put(t.getY_tile(), t));
        return out;
    }

    public Set<Tile> getTiles() {
        return tiles;
    }

    public Tile[][] getGrid() {
        if (grid == null) {
            grid = new Tile[Config.CHUNK_SIZE][Config.CHUNK_SIZE];
            getTiles().forEach(t -> grid[t.getY_tile()][t.getX_tile()] = t);
        }
        return grid;
    }

    public void setTiles(Set<Tile> tiles) {
        this.tiles = tiles;
    }

    public ChunkId getId() {
        return id;
    }

    public void setId(ChunkId id) {
        this.id = id;
    }

    private void initTiles() {
        tiles = new TreeSet<>();

        for (int y = 0; y < Config.CHUNK_SIZE; y++) {
            for (int x = 0; x < Config.CHUNK_SIZE; x++) {
                tiles.add(new Tile(this, x, y));
            }
        }
    }


    public TreeSet<Tile> getR_first() {
        return new TreeSet<>(Arrays.asList(getGrid()[0]));
    }

    public TreeSet<Tile> getR_last() {
        return new TreeSet<>(Arrays.asList(getGrid()[Config.CHUNK_SIZE - 1]));
    }

    public TreeSet<Tile> getC_first() {
        TreeSet<Tile> out = new TreeSet<>();
        for (Tile[] row : getGrid())
            out.add(row[0]);
        return out;
    }


    public TreeSet<Tile> getC_last() {
        TreeSet<Tile> out = new TreeSet<>();
        for (Tile[] row : getGrid())
            out.add(row[Config.CHUNK_SIZE - 1]);
        return out;
    }

    public Tile getT_upper_left() {
        return getGrid()[0][0];
    }


    public Tile getT_lower_left() {
        return getGrid()[Config.CHUNK_SIZE - 1][0];
    }

    public Tile getT_upper_right() {
        return getGrid()[0][Config.CHUNK_SIZE - 1];
    }


    public Tile getT_lower_right() {
        return getGrid()[Config.CHUNK_SIZE - 1][Config.CHUNK_SIZE - 1];
    }

    public boolean isFilled() {
        return filled;
    }

    public void setFilled(boolean filled) {
        this.filled = filled;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Chunk chunk = (Chunk) o;
        return this.id.equals(chunk.id);
    }

    @Override
    public int hashCode() {
        return id.hashCode();
    }

    @Override
    public String toString() {
        return "Chunk{" +
                "id=" + id +
                '}';
    }
}
