package de.sksdev.infiniteminesweeper.db.entities;


import javax.persistence.*;
import java.io.Serializable;


class TileId implements Serializable {
    private long x;
    private long y;
    private int x_tile;
    private int y_tile;

    public TileId(){
    }
}

@Entity
@Table(name = "tiles")
@IdClass(TileId.class)
public class Tile implements Comparable<Tile> {

    public Tile(){
    }

    public Tile(Chunk chunk, int x_tile, int y_tile) {
        this.x = chunk.getX();
        this.y = chunk.getY();
        this.x_tile = x_tile;
        this.y_tile = y_tile;
        this.value = null;
    }

    @Override
    public int compareTo(Tile other) {
        int y_dist = this.y_tile - other.getY_tile();
        return y_dist != 0 ? y_dist : this.x_tile - other.getX_tile();
    }


    @Id
    private long x;

    @Id
    private long y;

    @Id
    private int x_tile;

    @Id
    private int y_tile;

    @OneToOne
    @JoinColumns({
            @JoinColumn(name = "x"),
            @JoinColumn(name = "y"),
            @JoinColumn(name = "y_tile")
    })
    @MapsId
    private Row row;
    @OneToOne
    @JoinColumns({
            @JoinColumn(name = "x"),
            @JoinColumn(name = "x_tile"),
            @JoinColumn(name = "y")
    })
    @MapsId
    private EdgeColumn edgeColumn;

    @OneToOne
    @JoinColumns({
            @JoinColumn(name = "x", insertable = false, updatable = false),
            @JoinColumn(name = "y", insertable = false, updatable = false)
    })
    @MapsId
    private Chunk chunk;


    @Column(name = "value", length = 10, nullable = false)
    private Integer value = 0;
    @Column(name = "hidden")
    private boolean hidden = true;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;


    public Row getRow() {
        return row;
    }

    public void setRow(Row row) {
        this.row = row;
    }

    public int getValue() {
        return value;
    }

    public void setValue(int value) {
        this.value = value;
    }

    public boolean isHidden() {
        return hidden;
    }

    public void setHidden(boolean hidden) {
        this.hidden = hidden;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public EdgeColumn getEdgeColumn() {
        return edgeColumn;
    }

    public void setEdgeColumn(EdgeColumn edgeColumn) {
        this.edgeColumn = edgeColumn;
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

    public int getX_tile() {
        return x_tile;
    }

    public void setX_tile(int x_tile) {
        this.x_tile = x_tile;
    }

    public int getY_tile() {
        return y_tile;
    }

    public void setY_tile(int y_tile) {
        this.y_tile = y_tile;
    }


}
