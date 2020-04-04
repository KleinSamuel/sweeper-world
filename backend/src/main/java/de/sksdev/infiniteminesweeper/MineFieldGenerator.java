package de.sksdev.infiniteminesweeper;

import de.sksdev.infiniteminesweeper.db.entities.Tile;

import java.util.Random;
import java.util.Set;

public class MineFieldGenerator {

    public static Random random;
    public static int thresh = (int) (Config.MINE_PROB * 1000);

    public static void determineValues(Tile[][] field) {
        Integer[][] values = new Integer[Config.CHUNK_SIZE + 2][Config.CHUNK_SIZE + 2];
        for (int y = 0; y < field.length; y++) {
            for (int x = 0; x < field[y].length; x++) {
                values[y][x] = field[y][x].getValue();
            }
        }
        for (int y = 1; y < field.length - 1; y++) {
            for (int x = 1; x < field[y].length - 1; x++) {
                if (values[y][x] == null || values[y][x] != 9)
                    field[y][x].setValue(countBombs(values, x, y));
            }
        }
    }


    private static int countBombs(Integer[][] field, int x, int y) {
        int bombs = 0;
        for (int oy = -1; oy < 2; oy++) {
            int yb = y + oy;
            if (!(yb < 0 | yb > field.length - 1))
                for (int ox = -1; ox < 2; ox++) {
                    int xb = x + ox;
                    if (!(xb < 0 | xb > field[yb].length - 1 | (xb == x && yb == y))) {
                        try {
                            if (field[yb][xb] > 8)
                                bombs++;
                        } catch (NullPointerException ignore) {
                        }
                    }
                }
        }
        return bombs;
    }

    public static void setMines(Set<Tile> tiles) {
        tiles.forEach(t -> t.setValue(nextMine() ? 9 : null));
    }

    private static String toString(Tile[][] field) {
        StringBuilder s = new StringBuilder("-----Field----\n");
        for (Tile[] ts : field) {
            for (int x = 0; x < field.length; x++) {
                Integer value = ts[x].getValue();
                s.append(value == null ? "0" : (value == 9 ? "X" : value + "")).append(" ");
            }
            s.append("\n");
        }
        return s.toString();
    }

    private static void addBombCounts(Integer[][] field, int x, int y) {
        for (int oy = -1; oy < 2; oy++) {
            int yb = y + oy;
            if (!(yb < 0 | yb > field.length - 1/* | (yb == 0 & y == 0) | (yb == field.length - 1 & y == field.length - 1)*/))
                for (int ox = -1; ox < 2; ox++) {
                    int xb = x + ox;
                    if (!(xb < 0 | xb > field[yb].length - 1/* | (xb == 0 & x == 0) | (xb == field[yb].length - 1 & x == field[yb].length - 1)*/)) {
                        Integer value = field[yb][xb];
                        if (value == null)
                            field[yb][xb] = 1;
                        else if (value < 9)
                            field[yb][xb]++;
                    }
                }
        }
    }

    public static boolean nextMine() {
        try {
            return random.nextInt(1000) < thresh;
        } catch (NullPointerException e) {
            random = getRandom();
        }
        return random.nextInt(1000) < thresh;
    }

    public static Random getRandom() {
        if (random == null)
            random = new Random(new Random(System.currentTimeMillis()).nextLong() + System.currentTimeMillis());
        return random;
    }

}
