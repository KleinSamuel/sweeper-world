package de.sksdev.infiniteminesweeper.communication.responses;

import de.sksdev.infiniteminesweeper.db.entities.Ids.TileId;
import de.sksdev.infiniteminesweeper.db.entities.User;
import de.sksdev.infiniteminesweeper.db.entities.UserSettings;
import de.sksdev.infiniteminesweeper.db.entities.UserStats;

import java.util.UUID;

public class LoginResponse {

    private String hash;
    private long id;
    private TileId hometile;
    private UserSettings userSettings;
    private UserStats userStats;

    public LoginResponse(User u, UserStats userStats) {
        this.id = u.getId();
        hash = UUID.randomUUID().toString();
        u.setHash(hash);
        setHometile(u.getHome());
        this.userSettings = u.getSettings();
        this.userStats=userStats;
    }

    public String getHash() {
        return hash;
    }

    public long getId() {
        return id;
    }

    public void setHometile(TileId id) {
        hometile = id;
    }

    public TileId getHometile() {
        return hometile;
    }

    public UserSettings getUserSettings() {
        return userSettings;
    }

    public void setUserSettings(UserSettings userSettings) {
        this.userSettings = userSettings;
    }

    public UserStats getUserStats() {
        return userStats;
    }

    public void setUserStats(UserStats userStats) {
        this.userStats = userStats;
    }
}
