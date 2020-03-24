package de.sksdev.infiniteminesweeper.db.entities;


import de.sksdev.infiniteminesweeper.db.entities.Ids.TileId;

import javax.persistence.*;


@Entity
@Table(name = "tiles")
public class Tile implements Comparable<Tile> {

    public Tile(){
    }

    public Tile(Chunk chunk, int x_tile, int y_tile) {
       id = new TileId(chunk.getX(),chunk.getY(),x_tile,y_tile);
        this.value = null;
    }

    @Override
    public int compareTo(Tile other) {
        int y_dist = this.getY_tile() - other.getY_tile();
        return y_dist != 0 ? y_dist : this.getX_tile() - other.getX_tile();
    }


    @Id
    private TileId id;

    @OneToOne
    @JoinColumns({
            @JoinColumn(name = "x", insertable = false, updatable = false),
            @JoinColumn(name = "y", insertable = false, updatable = false),
            @JoinColumn(name = "y_tile", insertable = false, updatable = false)
    })
//    @MapsId
    private Row row;


    @OneToOne
    @JoinColumns({
            @JoinColumn(name = "x", insertable = false, updatable = false),
            @JoinColumn(name = "x_tile", insertable = false, updatable = false),
            @JoinColumn(name = "y", insertable = false, updatable = false)
    })
//    @MapsId
    private EdgeColumn edgeColumn;

    @OneToOne
    @JoinColumns({
            @JoinColumn(name = "x", insertable = false, updatable = false),
            @JoinColumn(name = "y", insertable = false, updatable = false)
    })
//    @MapsId
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

    public TileId getId() {
        return id;
    }

    public void setId(TileId id) {
        this.id = id;
    }

    public void setValue(Integer value) {
        this.value = value;
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

    public int getY_tile() {
        return getId().getY_tile();
    }

    public void setY_tile(int y_tile) {
        getId().setY_tile(y_tile);
    }


}
