package de.sksdev.infiniteminesweeper;

import java.util.Random;

public class MineFiledGenerator {

    public static Random mine;

    public static Integer[][] generateField(Integer[][] field) {
        boolean mine;
        for (int y = 0; y < field.length; y++) {
            for (int x = 0; x < field[y].length; x++) {
                if (!(field[y][x] != null && (y < 1 | y > field.length - 2 | x < 1 | x > field.length - 2))) {
                    mine = nextMine();
                    if (mine) {
                        field[y][x] = 9;
                    } else
                        field[y][x] = 0;

                }
                if (field[y][x] > 8)
                    addBombCounts(field, x, y);
            }
        }

        return field;
    }

    private static void addBombCounts(Integer[][] field, int x, int y) {
        for (int oy = -1; oy < 2; oy++) {
            int yb = y + oy;
            if (!(yb < 1 | yb > field.length - 2))
                for (int ox = -1; ox < 2; ox++) {
                    int xb = x + ox;
                    if (!(xb < 1 | xb > field.length)) {
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
            return mine.nextInt((int) (Config.MINE_PROB * 1000)) < 10;
        } catch (NullPointerException e) {
            mine = new Random();
        }
        return mine.nextInt((int) (Config.MINE_PROB * 1000)) < 10;
    }

}
