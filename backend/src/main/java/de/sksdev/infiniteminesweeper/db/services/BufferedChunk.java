package de.sksdev.infiniteminesweeper.db.services;


import de.sksdev.infiniteminesweeper.Config;
import de.sksdev.infiniteminesweeper.db.entities.Chunk;

public class BufferedChunk implements Comparable<BufferedChunk> {

    private Chunk chunk;

    private long timestamp;

    public BufferedChunk(Chunk c) {
        this.chunk = c;
        update();
    }


    public BufferedChunk update() {
        timestamp = System.currentTimeMillis();
        return this;
    }

    public Chunk getChunk() {
        return chunk;
    }

    public void setChunk(Chunk chunk) {
        this.chunk = chunk;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    @Override
    public int compareTo(BufferedChunk other) {
        long complete_dist = this.getTimestamp() - other.getTimestamp();
        if (Math.abs(complete_dist) > Integer.MAX_VALUE)
            return Long.signum(complete_dist) * Integer.MAX_VALUE;
        int t_dist = (int) complete_dist;
        if (t_dist != 0)
            return t_dist;
        else
            return this.getChunk().getId().compareTo(other.getChunk().getId());
    }
}
