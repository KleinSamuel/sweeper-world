package de.sksdev.infiniteminesweeper.db.entities;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Set;
import java.util.TreeSet;

class ColId implements Serializable {
    private long x;
    private long y;
    private int x_tile;

    public ColId() {

    }
}


@Entity
@Table(name = "edge_columns")
@IdClass(ColId.class)
public class EdgeColumn {

    public EdgeColumn() {
    }

    public EdgeColumn(Chunk chunk, int x_tile) {
        this.chunk = chunk;
        this.x = chunk.getX();
        this.y = chunk.getY();
        this.x_tile = x_tile;
    }

    @Id
    private long x;

    @Id
    private long y;

    @Id
    private int x_tile;

    @OneToOne
    @JoinColumns({
            @JoinColumn(name = "x", insertable = false, updatable = false),
            @JoinColumn(name = "y", insertable = false, updatable = false)
    })
    @MapsId
    private Chunk chunk;


    @OneToMany(mappedBy = "edgeColumn", cascade = CascadeType.ALL)
    private Set<Tile> tiles = new TreeSet<>();


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

    public TreeSet<Tile> getTiles() {
        return (TreeSet<Tile>) tiles;
    }

    public void setTiles(TreeSet<Tile> tiles) {
        this.tiles = tiles;
    }

    public void addTile(Tile t) {
        this.tiles.add(t);
    }

}
