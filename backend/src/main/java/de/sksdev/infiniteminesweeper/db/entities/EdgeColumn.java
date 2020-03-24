package de.sksdev.infiniteminesweeper.db.entities;

import de.sksdev.infiniteminesweeper.db.entities.Ids.ColId;

import javax.persistence.*;
import java.util.Set;
import java.util.TreeSet;


@Entity
@Table(name = "edge_columns")
public class EdgeColumn {

    public EdgeColumn() {
    }

    public EdgeColumn(Chunk chunk, int x_tile) {
        this.chunk = chunk;
        id = new ColId(chunk.getX(),chunk.getY(),x_tile);
    }

    @Id
    private ColId id;

    @OneToOne
    @JoinColumns({
            @JoinColumn(name = "x", insertable = false, updatable = false),
            @JoinColumn(name = "y", insertable = false, updatable = false)
    })
//    @MapsId
    private Chunk chunk;


    @OneToMany(mappedBy = "edgeColumn", cascade = CascadeType.ALL)
    private Set<Tile> tiles = new TreeSet<>();


    public ColId getId() {
        return id;
    }

    public void setId(ColId id) {
        this.id = id;
    }

    public void setTiles(Set<Tile> tiles) {
        this.tiles = tiles;
    }

    public long getX() {
        return getId().getX();
    }

    public void setX(long x) {
        getId().setX(x);
    }

    public long getY() {
        return getId().getY();
    }

    public void setY(long y) {
        getId().setY(y);
    }

    public int getX_tile() {
        return getId().getX_tile();
    }

    public void setX_tile(int x_tile) {
        getId().setX_tile(x_tile);
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
