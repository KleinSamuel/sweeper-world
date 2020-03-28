package de.sksdev.infiniteminesweeper.db.entities;


import com.fasterxml.jackson.annotation.JsonIgnore;
import de.sksdev.infiniteminesweeper.db.entities.Ids.TileId;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Set;


@Entity
@Table(name = "tiles")
@IdClass(TileId.class)
public class Tile implements Comparable<Tile>, Serializable {

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
    @JsonIgnore
    private int x_tile;

    @Id
    @Column(columnDefinition = "TINYINT(1)")
    @JsonIgnore
    private int y_tile;

    @Id
    @JsonIgnore
    private int x;

    @Id
    @JsonIgnore
    private int y;

    @MapsId
    @JoinColumns({
            @JoinColumn(name = "x", insertable = false, updatable = false),
            @JoinColumn(name = "y", insertable = false, updatable = false)
    })
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    private Chunk chunk;


    @Column(name = "value", columnDefinition = "TINYINT(1)")
    private Integer value = null;
    @Column(name = "hidden")
    private boolean hidden = true;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;


    public User getUser() {
        return user;
    }

    public boolean setUser(User user) {
        if (this.user == null) {
            this.user = user;
            return true;
        }
        return false;
    }

    @JsonIgnore
    public TileId getId() {
        return new TileId(x, y, x_tile, y_tile);
    }


    public Integer getValue() {
        return value;
    }

    public void setValue(int value) {
        this.value = value;
    }

    public boolean isHidden() {
        return hidden;
    }

    public boolean setHidden(boolean hidden) {
        if (this.hidden & !hidden) {
            this.hidden = false;
            return true;
        }
        return false;

    }


    public void setValue(Integer value) {
        this.value = value;
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

    public Chunk getChunk() {
        return chunk;
    }

    public void setChunk(Chunk chunk) {
        this.chunk = chunk;
        this.setX(chunk.getX());
        this.setY(chunk.getY());
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


    public boolean open(User user) {
        if (this.hidden & this.user == null) {
            this.hidden = false;
            this.user = user;
            return true;
        }
        return false;
    }
}
