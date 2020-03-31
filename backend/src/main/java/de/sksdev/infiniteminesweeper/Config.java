package de.sksdev.infiniteminesweeper;

public class Config {

    public final static float MINE_PROB = 0.2f;
    public final static int CHUNK_SIZE = 32;
    public final static int BUFFER_DECAY = 20_000;
    public final static int CLEANER_INTERVAL = 10_000;
    public final static int BUFFERED_CHUNK_CAP = 100;

    public final static int FLAG_SCORE = (int)(MINE_PROB * 20);
    public final static int STREAK_MULTI_MAX = 250;

    public static long score(int streak, int value) {
        return value * getMultiplicator(streak);
    }

    public static long scoreFlag(int streak) {
        return FLAG_SCORE * getMultiplicator(streak);
    }

    public static int getMultiplicator(long streak) {
        return (int)Math.min(STREAK_MULTI_MAX, 100 + (streak / 10));
    }
}
