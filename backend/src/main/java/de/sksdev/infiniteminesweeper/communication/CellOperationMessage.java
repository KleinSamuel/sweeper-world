package de.sksdev.infiniteminesweeper.communication;

public class CellOperationMessage {

    private long chunkX;
    private long chunkY;
    private int x;
    private int y;
    private long user;

    public CellOperationMessage() {

    }

    public long getChunkX() {
        return chunkX;
    }

    public void setChunkX(long chunkX) {
        this.chunkX = chunkX;
    }

    public long getChunkY() {
        return chunkY;
    }

    public void setChunkY(long chunkY) {
        this.chunkY = chunkY;
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

    public long getUser() {
        return user;
    }

    public void setUser(long user) {
        this.user = user;
    }
}
