package de.sksdev.infiniteminesweeper.communication.requests;

import de.sksdev.infiniteminesweeper.db.entities.Ids.ChunkId;

public class ChunkRequest {

    private Long userId;
    private String hash;
    private Integer chunkX;
    private Integer chunkY;

    public ChunkRequest() {
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

    public ChunkId getChunkId() {
        return new ChunkId(chunkX, chunkY);
    }
}
