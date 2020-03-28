package de.sksdev.infiniteminesweeper.db.entities;


import de.sksdev.infiniteminesweeper.db.entities.Ids.TileId;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Set;

@Entity
@Table(name = "users")
public class User implements Serializable {


    public User() {
    }

    public User(String name, TileId tile) {
        this.name = name;
        home=tile;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false, unique = true, length=32)
    private String name;

    private TileId home;

    @OneToMany(mappedBy = "user")
    private Set<Tile> tiles;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public TileId getHome() {
        return home;
    }

    public void setHome(TileId home) {
        this.home = home;
    }

}