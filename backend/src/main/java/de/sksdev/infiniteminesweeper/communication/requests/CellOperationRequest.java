package de.sksdev.infiniteminesweeper.communication.requests;

public class CellOperationRequest {

    private int chunkX;
    private int chunkY;
    private int cellX;
    private int cellY;
    private boolean hidden;
    private long user;

    public CellOperationRequest() {
    }

    public CellOperationRequest(int chunkX, int chunkY, int cellX, int cellY, long user, boolean hidden) {
        this.chunkX = chunkX;
        this.chunkY = chunkY;
        this.cellX = cellX;
        this.cellY = cellY;
        this.user = user;
        this.hidden = hidden;
    }

    public CellOperationRequest(CellRequest request, boolean hidden) {
        this(request.getChunkX(), request.getChunkY(), request.getCellX(), request.getCellY(), request.getUserId(), hidden);
    }

    public int getChunkX() {
        return chunkX;
    }

    public void setChunkX(int chunkX) {
        this.chunkX = chunkX;
    }

    public int getChunkY() {
        return chunkY;
    }

    public void setChunkY(int chunkY) {
        this.chunkY = chunkY;
    }

    public int getCellX() {
        return cellX;
    }

    public void setCellX(int cellX) {
        this.cellX = cellX;
    }

    public int getCellY() {
        return cellY;
    }

    public void setCellY(int cellY) {
        this.cellY = cellY;
    }

    public long getUser() {
        return user;
    }

    public void setUser(long user) {
        this.user = user;
    }

    public boolean isHidden() {
        return hidden;
    }

    public void setHidden(boolean hidden) {
        this.hidden = hidden;
    }
}
