package de.sksdev.infiniteminesweeper.db.entities;

import de.sksdev.infiniteminesweeper.db.entities.Ids.TileId;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Set;
import java.util.UUID;

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

    @Column(unique = true)
    private String email;

    @Transient
    private String hash;

    @Column
    private boolean verified;

    @Column
    private String verifier;

    public User() {
    }

    public User(String name, String token, boolean isGuest, TileId tile, String email) {
        this.name = name;
        this.home = tile;
        this.settings = new UserSettings(this);
        this.token = token;
        this.email = email;
        this.verified = false;
        this.verifier = UUID.randomUUID().toString().replaceAll("-", "").substring(10);
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isVerified() {
        return verified;
    }

    public void setVerified(boolean verified) {
        this.verified = verified;
    }

    public String getVerifier() {
        return verifier;
    }

    public void setVerifier(String verifier) {
        this.verifier = verifier;
    }
}