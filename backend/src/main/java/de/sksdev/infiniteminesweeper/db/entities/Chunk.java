package de.sksdev.infiniteminesweeper.db.entities;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import de.sksdev.infiniteminesweeper.Config;
import de.sksdev.infiniteminesweeper.db.entities.Ids.ChunkId;

import javax.persistence.*;
import java.util.HashMap;
import java.util.Set;
import java.util.TreeSet;


@Entity
@Table(name = "chunks")
public class Chunk {


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

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnore
    private Set<Tile> r_first;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnore
    private Set<Tile> r_last;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnore
    private Set<Tile> c_first;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnore
    private Set<Tile> c_last;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnore
    private Tile t_upper_left;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnore
    private Tile t_lower_left;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnore
    private Tile t_upper_right;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnore
    private Tile t_lower_right;


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
        r_first = new TreeSet<>();
        r_last = new TreeSet<>();
        c_first = new TreeSet<>();
        c_last = new TreeSet<>();

        for (int y = 0; y < Config.CHUNK_SIZE; y++) {
            TreeSet<Tile> r = new TreeSet<>();
            for (int x = 0; x < Config.CHUNK_SIZE; x++) {
                Tile t = new Tile(this, x, y);
                tiles.add(t);
                if (y < 1)
                    r_first.add(t);
                else if (y > Config.CHUNK_SIZE - 2)
                    r_last.add(t);
                if (x == 0) {
                    c_first.add(t);
                    if (y == 0)
                        t_upper_left = t;
                    else if (y == Config.CHUNK_SIZE - 1)
                        t_lower_left = t;
                }
                if (x == Config.CHUNK_SIZE - 1) {
                    c_last.add(t);
                    if (y == 0)
                        t_upper_right = t;
                    else if (y == Config.CHUNK_SIZE - 1)
                        t_lower_right = t;
                }
            }
        }
    }


    public TreeSet<Tile> getR_first() {
        return (TreeSet<Tile>) r_first;
    }

    public void setR_first(TreeSet<Tile> r_first) {
        this.r_first = r_first;
    }

    public TreeSet<Tile> getR_last() {
        return (TreeSet<Tile>) r_last;
    }

    public void setR_last(TreeSet<Tile> r_last) {
        this.r_last = r_last;
    }

    public TreeSet<Tile> getC_first() {
        return (TreeSet<Tile>) c_first;
    }

    public void setC_first(TreeSet<Tile> c_first) {
        this.c_first = c_first;
    }

    public TreeSet<Tile> getC_last() {
        return (TreeSet<Tile>) c_last;
    }

    public void setC_last(TreeSet<Tile> c_last) {
        this.c_last = c_last;
    }

    public Tile getT_upper_left() {
        return t_upper_left;
    }

    public void setT_upper_left(Tile t_upper_left) {
        this.t_upper_left = t_upper_left;
    }

    public Tile getT_lower_left() {
        return t_lower_left;
    }

    public void setT_lower_left(Tile t_lower_left) {
        this.t_lower_left = t_lower_left;
    }

    public Tile getT_upper_right() {
        return t_upper_right;
    }

    public void setT_upper_right(Tile t_upper_right) {
        this.t_upper_right = t_upper_right;
    }

    public Tile getT_lower_right() {
        return t_lower_right;
    }

    public void setT_lower_right(Tile t_lower_right) {
        this.t_lower_right = t_lower_right;
    }

    public boolean isFilled() {
        return filled;
    }

    public void setFilled(boolean filled) {
        this.filled = filled;
    }
}
