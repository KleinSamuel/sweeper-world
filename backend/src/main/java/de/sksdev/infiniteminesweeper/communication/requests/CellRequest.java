package de.sksdev.infiniteminesweeper.communication.requests;


import de.sksdev.infiniteminesweeper.db.entities.Ids.ChunkId;

public class CellRequest {

    private Long userId;
    private String hash;
    private Integer chunkX;
    private Integer chunkY;
    private Integer cellX;
    private Integer cellY;
    private boolean flag;

    public CellRequest() {
    }


    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getHash() {
        return hash;
    }

    public void setHash(String hash) {
        this.hash = hash;
    }

    public Integer getChunkX() {
        return chunkX;
    }

    public void setChunkX(Integer chunkX) {
        this.chunkX = chunkX;
    }

    public Integer getChunkY() {
        return chunkY;
    }

    public void setChunkY(Integer chunkY) {
        this.chunkY = chunkY;
    }

    public Integer getCellX() {
        return cellX;
    }

    public void setCellX(Integer cellX) {
        this.cellX = cellX;
    }

    public Integer getCellY() {
        return cellY;
    }

    public void setCellY(Integer cellY) {
        this.cellY = cellY;
    }

    public boolean isFlag() {
        return flag;
    }

    public void setFlag(boolean flag) {
        this.flag = flag;
    }

    public ChunkId getChunkId() {
        return new ChunkId(chunkX, chunkY);
    }


}
