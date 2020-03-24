package de.sksdev.infiniteminesweeper.db.services;


import de.sksdev.infiniteminesweeper.Config;
import de.sksdev.infiniteminesweeper.MineFiledGenerator;
import de.sksdev.infiniteminesweeper.db.entities.Chunk;
import de.sksdev.infiniteminesweeper.db.entities.ChunkId;
import de.sksdev.infiniteminesweeper.db.entities.Tile;
import de.sksdev.infiniteminesweeper.db.repositories.ChunkRepository;
import de.sksdev.infiniteminesweeper.db.repositories.RowRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ChunkService {


    @Autowired
    ChunkRepository chunkRepository;

    @Autowired
    RowRepository rowRepository;


    //    TODO use objectgetter for cached entries?
    public Chunk getOrCreateChunk(long x, long y) {
        return chunkRepository.findById(new ChunkId(x,y)).orElse(newChunk(x, y));
    }

    public Chunk getOrCreateChunkContent(long x, long y) {
        Chunk c = getOrCreateChunk(x, y);
        return c.isFilled() ? c : generateContent(c);
    }

    private Chunk newChunk(long x, long y) {
        System.out.println("Creating Chunk " + x + "/" + y);
        return save(new Chunk(x, y));
    }

    private Chunk generateContent(Chunk c) {
        System.out.println("Filling Chunk " + c.getX() + "/" + c.getY());
        Chunk[][] neighborhood = getNeighborhood(c);
        generateField(neighborhood);
        c.setFilled(true);
        return c;
    }

    private Chunk[][] getNeighborhood(Chunk c) {
        Chunk[][] neighborhood = new Chunk[3][3];
        neighborhood[1][1] = c;
        for (int y = 0; y < 3; y++) {
            for (int x = 0; x < 3; x++) {
                if (!(x == 0 & y == 0))
                    neighborhood[y][x] = getOrCreateChunk(x + c.getX() - 1, y + c.getY() - 1);
            }
        }
        return neighborhood;
    }

    private void generateField(Chunk[][] n) {
        Tile[][] field = new Tile[Config.CHUNK_SIZE + 2][Config.CHUNK_SIZE + 2];

        field[0][0] = n[0][0].getT_lower_right();
        field[0][Config.CHUNK_SIZE + 1] = n[0][2].getT_lower_left();
        field[Config.CHUNK_SIZE + 1][0] = n[2][0].getT_upper_right();
        field[Config.CHUNK_SIZE + 1][Config.CHUNK_SIZE + 1] = n[2][2].getT_upper_left();

        n[0][1].getR_last().getTiles().forEach(t -> field[0][t.getX_tile() + 1] = t);
        n[1][0].getC_last().getTiles().forEach(t -> field[t.getY_tile() + 1][0] = t);
        n[2][1].getR_first().getTiles().forEach(t -> field[Config.CHUNK_SIZE - 1][t.getX_tile() + 1] = t);
        n[1][2].getC_first().getTiles().forEach(t -> field[t.getY_tile() + 1][Config.CHUNK_SIZE - 1] = t);

        determineValues(field);
        saveAllNeighbors(n);
    }

    private void saveAllNeighbors(Chunk[][] n) {
        for (int y = 0; y < n.length; y++) {
            for (int x = 0; x < n[y].length; x++) {
                save(n[y][x]);
            }
        }
    }

    private void determineValues(Tile[][] field) {
        Integer[][] values = new Integer[Config.CHUNK_SIZE + 2][Config.CHUNK_SIZE + 2];
        for (int y = 0; y < field.length; y++) {
            for (int x = 0; x < field[y].length; x++) {
                values[y][x] = field[y][x].getValue();
            }
        }
        values = MineFiledGenerator.generateField(values);
        for (int y = 0; y < values.length; y++) {
            for (int x = 0; x < values[y].length; x++) {
                if (!(values[y][x] != 9 & (y < 1 | y > Config.CHUNK_SIZE - 2 | x < 1 | x > Config.CHUNK_SIZE - 2)))
                    field[y][x].setValue(values[y][x]);
            }
        }
    }

    public Chunk save(Chunk c) {
        System.out.println("Saving Chunk "+c.getX()+"/"+c.getY());
        rowRepository.saveAll(c.getRows());
        return chunkRepository.save(c);
    }



}
