package de.sksdev.infiniteminesweeper.db.entities;

import de.sksdev.infiniteminesweeper.Config;
import de.sksdev.infiniteminesweeper.db.entities.Ids.ChunkId;

import javax.persistence.*;
import java.util.Set;
import java.util.TreeSet;


@Entity
@Table(name = "chunks")
public class Chunk {

    public Chunk() {
    }

    public Chunk(long x, long y) {
        id = new ChunkId(x,y);
        initTiles();
    }

    @Id
    private ChunkId id;

    @Column
    private boolean filled = false;

    @OneToMany(mappedBy = "chunk", fetch = FetchType.LAZY)
    private Set<Row> rows;

    @OneToOne(cascade = CascadeType.ALL)
    private Row r_first;

    @OneToOne(cascade = CascadeType.ALL)
    private Row r_last;

    @OneToOne(cascade = CascadeType.ALL)
    private EdgeColumn c_first;

    @OneToOne(cascade = CascadeType.ALL)
    private EdgeColumn c_last;

    @OneToOne(cascade = CascadeType.ALL)
    private Tile t_upper_left;

    @OneToOne(cascade = CascadeType.ALL)
    private Tile t_lower_left;

    @OneToOne(cascade = CascadeType.ALL)
    private Tile t_upper_right;

    @OneToOne(cascade = CascadeType.ALL)
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
        rows.forEach(r ->
                r.getTiles().forEach(t -> t.setValue(values[t.getY_tile()][t.getX_tile()]))
        );

    }


    private void initTiles() {
        rows = new TreeSet<>();
        c_first = new EdgeColumn(this, 0);
        c_last = new EdgeColumn(this, Config.CHUNK_SIZE - 1);

        for (int y = 0; y < Config.CHUNK_SIZE; y++) {
            Row r = new Row(this, y);
            for (int x = 0; x < Config.CHUNK_SIZE; x++) {
                Tile t = new Tile(this, x, y);
                r.addTile(t);
                if (x == 0) {
                    c_first.addTile(t);
                    if (y == 0)
                        t_upper_left = t;
                    else if (y == Config.CHUNK_SIZE - 1)
                        t_lower_left = t;
                }
                if (x == Config.CHUNK_SIZE - 1) {
                    c_last.addTile(t);
                    if (y == 0)
                        t_upper_right = t;
                    else if (y == Config.CHUNK_SIZE - 1)
                        t_lower_right = t;
                }
            }
            rows.add(r);
        }
    }

    public Set<Row> getRows() {
        return rows;
    }

    public void setRows(Set<Row> rows) {
        this.rows = rows;
    }

    public Row getR_first() {
        return r_first;
    }

    public void setR_first(Row r_first) {
        this.r_first = r_first;
    }

    public Row getR_last() {
        return r_last;
    }

    public void setR_last(Row r_last) {
        this.r_last = r_last;
    }

    public EdgeColumn getC_first() {
        return c_first;
    }

    public void setC_first(EdgeColumn c_first) {
        this.c_first = c_first;
    }

    public EdgeColumn getC_last() {
        return c_last;
    }

    public void setC_last(EdgeColumn c_last) {
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
