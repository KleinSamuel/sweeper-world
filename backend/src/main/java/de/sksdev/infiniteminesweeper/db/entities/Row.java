package de.sksdev.infiniteminesweeper.db.entities;

import de.sksdev.infiniteminesweeper.db.entities.Ids.RowId;

import javax.persistence.*;
import java.util.Set;
import java.util.TreeSet;


@Entity
@Table(name = "rows")
public class Row implements Comparable<Row> {

    public Row(){
    }

    public Row(Chunk chunk, int y_tile) {
        this.chunk = chunk;
        id = new RowId(chunk.getX(),chunk.getY(),y_tile);
    }


    @Id
    private RowId id;

    @OneToOne
    @JoinColumns({
            @JoinColumn(name = "x", insertable = false, updatable = false),
            @JoinColumn(name = "y", insertable = false, updatable = false)
    })
//    @MapsId
    private Chunk chunk;

    @OneToMany(mappedBy = "row", cascade = CascadeType.ALL)
    private Set<Tile> tiles = new TreeSet<>();

    @Override
    public int compareTo(Row other) {
        return this.getY_tile() - other.getY_tile();
    }

    public RowId getId() {
        return id;
    }

    public void setId(RowId id) {
        this.id = id;
    }

    public long getX() {
        return getId().getX();
    }

    public void setX(long x) {
        this.getId().setX(x);
    }

    public long getY() {
        return getId().getY();
    }

    public void setY(long y) {
        getId().setY(y);
    }

    public int getY_tile() {
        return getId().getY_tile();
    }

    public void setY_tile(int y_tile) {
        getId().setY_tile(y_tile);
    }

    public TreeSet<Tile> getTiles() {
        return (TreeSet<Tile>) tiles;
    }

    public void setTiles(Set<Tile> tiles) {
        this.tiles = tiles;
    }


    public void addTile(Tile t) {
        tiles.add(t);
    }

}
