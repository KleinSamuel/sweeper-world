package de.sksdev.infiniteminesweeper.communication;

import de.sksdev.infiniteminesweeper.db.entities.Ids.TileId;
import de.sksdev.infiniteminesweeper.db.entities.User;

import java.util.UUID;

public class LoginResponse {

    private String hash;
    private long id;
    private TileId hometile;

    public LoginResponse(User u) {
        this.id = u.getId();
        hash = UUID.randomUUID().toString();
        setHometile(u.getHome());
    }

    public String getHash() {
        return hash;
    }

//    public void setHash(String hash) {
//        this.hash = hash;
//    }

    public long getId() {
        return id;
    }

//    public void setId(long id) {
//        this.id = id;
//    }

    public void setHometile(TileId id) {
        hometile = id;
    }

    public TileId getHometile() {
        return hometile;
    }
}
