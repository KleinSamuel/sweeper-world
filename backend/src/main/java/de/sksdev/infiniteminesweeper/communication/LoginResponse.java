package de.sksdev.infiniteminesweeper.communication;

public class LoginResponse {

    private String hash;
    private long id;

    public LoginResponse() {
    }

    public String getHash() {
        return hash;
    }

    public void setHash(String hash) {
        this.hash = hash;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }
}
