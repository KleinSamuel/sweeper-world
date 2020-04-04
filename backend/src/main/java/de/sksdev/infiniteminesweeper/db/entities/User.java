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

    @Column(nullable = false, length = 32, unique = true)
    private String name;

    @Column(nullable = false)
    private String token;

    @Column
    private boolean isGuest;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "settings_id", referencedColumnName = "id")
    private UserSettings settings;

    private TileId home;

    @OneToMany(mappedBy = "user")
    private Set<Tile> tiles;

    @Transient
    private String hash;

    public User() {
    }

    public User(String name, String token, boolean isGuest, TileId tile) {
        this.name = name;
        this.home = tile;
        this.settings = new UserSettings(this);
        this.token = token;
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

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
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

    public String getHash() {
        return hash;
    }

    public void setHash(String hash) {
        this.hash = hash;
    }
}