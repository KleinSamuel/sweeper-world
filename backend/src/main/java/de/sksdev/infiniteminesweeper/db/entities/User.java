package de.sksdev.infiniteminesweeper.db.entities;


import de.sksdev.infiniteminesweeper.db.entities.Ids.TileId;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Set;

@Entity
@Table(name = "users")
public class User implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false, length=32)
    private String name;

    @Column(nullable = false)
    private String password;

    @Column
    private boolean isGuest;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "settings_id", referencedColumnName = "id")
    private UserSettings settings;

    private TileId home;

    @OneToMany(mappedBy = "user")
    private Set<Tile> tiles;

    public User() {
    }

    public User(String name, String password, boolean isGuest, TileId tile) {
        this.name = name;
        this.password = password;
        this.home = tile;
        this.settings = new UserSettings(this);
    }

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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public UserSettings getSettings() {
        return settings;
    }

    public void setSettings(UserSettings settings) {
        this.settings = settings;
    }

    public TileId getHome() {
        return home;
    }

    public void setHome(TileId home) {
        this.home = home;
    }

}