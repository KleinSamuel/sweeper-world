package de.sksdev.infiniteminesweeper.db.entities;


import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "tiles")
@IdClass(Tile.TileId.class)
public class Tile {

    @Embeddable
    public class TileId implements Serializable {
        private long x;
        private long y;
        private int x_tile;
        private int y_tile;
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

    @Column(name = "value", length = 10)
    private int value;
    @Column(name = "hidden")
    private boolean hidden;

    @OneToOne
    @JoinColumn(name="user_id")
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
}
