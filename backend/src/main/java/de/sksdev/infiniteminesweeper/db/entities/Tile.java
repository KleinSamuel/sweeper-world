package de.sksdev.infiniteminesweeper.db.entities;


import com.fasterxml.jackson.annotation.JsonIgnore;
import de.sksdev.infiniteminesweeper.db.entities.Ids.TileId;
import org.hibernate.annotations.Type;

import javax.persistence.*;


@Entity
@Table(name = "tiles")
@IdClass(TileId.class)
public class Tile implements Comparable<Tile> {

    public Tile() {
    }

    public Tile(Chunk chunk, int x_tile, int y_tile) {
        setChunk(chunk);
        setX_tile(x_tile);
        setY_tile(y_tile);
        this.value = null;
    }

    @Override
    public int compareTo(Tile other) {
        int y_dist = this.getY_tile() - other.getY_tile();
        return y_dist != 0 ? y_dist : this.getX_tile() - other.getX_tile();
    }


    @Id
    @Column(columnDefinition = "TINYINT(1)")
    private int x_tile;

    @Id
    @Column(columnDefinition = "TINYINT(1)")
    private int y_tile;

    @Id
    private long x;

    @Id
    private long y;

    @MapsId
    @JoinColumns({
            @JoinColumn(name = "x", insertable = false, updatable = false),
            @JoinColumn(name = "y", insertable = false, updatable = false)
    })
    @ManyToOne
    @JsonIgnore
    private Chunk chunk;


    @Column(name = "value", columnDefinition = "TINYINT(1)")
    private Integer value = null;
    @Column(name = "hidden")
    private boolean hidden = true;


    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;


//    public Row getRow() {
//        return row;
//    }
//
//    public void setRow(Row row) {
//        this.row = row;
//    }

    public Integer getValue() {
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

//    public User getUser() {
//        return user;
//    }
//
//    public void setUser(User user) {
//        this.user = user;
//    }

//    public EdgeColumn getEdgeColumn() {
//        return edgeColumn;
//    }
//
//    public void setEdgeColumn(EdgeColumn edgeColumn) {
//        this.edgeColumn = edgeColumn;
//    }

//    public TileId getId() {
//        return id;
//    }
//
//    public void setId(TileId id) {
//        this.id = id;
//    }

    public void setValue(Integer value) {
        this.value = value;
    }

//    public long getX() {
//        return getId().getX();
//    }
//
//    public void setX(long x) {
//        getId().setX(x);
//    }
//
//    public long getY() {
//        return getId().getY();
//    }
//
//    public void setY(long y) {
//        getId().setY(y);
//    }
//
//    public int getX_tile() {
//        return getId().getX_tile();
//    }
//
//    public void setX_tile(int x_tile) {
//        getId().setX_tile(x_tile);
//    }
//
//    public int getY_tile() {
//        return getId().getY_tile();
//    }
//
//    public void setY_tile(int y_tile) {
//        getId().setY_tile(y_tile);
//    }


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

    public Chunk getChunk() {
        return chunk;
    }

    public void setChunk(Chunk chunk) {
        this.chunk = chunk;
        this.setX(chunk.getX());
        this.setY(chunk.getY());
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
}
