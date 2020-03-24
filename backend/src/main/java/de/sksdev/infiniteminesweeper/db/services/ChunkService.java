package de.sksdev.infiniteminesweeper.db.services;


import de.sksdev.infiniteminesweeper.Config;
import de.sksdev.infiniteminesweeper.MineFiledGenerator;
import de.sksdev.infiniteminesweeper.db.entities.Chunk;
import de.sksdev.infiniteminesweeper.db.entities.Ids.ChunkId;
import de.sksdev.infiniteminesweeper.db.entities.Ids.TileId;
import de.sksdev.infiniteminesweeper.db.entities.Tile;
import de.sksdev.infiniteminesweeper.db.repositories.ChunkRepository;
import de.sksdev.infiniteminesweeper.db.repositories.TileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ChunkService {


    final
    ChunkRepository chunkRepository;

    final
    TileRepository tileRepository;

    final
    SavingService savingService;

    @Autowired
    public ChunkService(ChunkRepository chunkRepository, TileRepository tileRepository, SavingService savingService) {
        this.chunkRepository = chunkRepository;
        this.tileRepository = tileRepository;
        this.savingService = savingService;
    }

    //    TODO use objectgetter for cached entries?
    public Chunk getOrCreateChunk(long x, long y, boolean persist) {
        return chunkRepository.findById(new ChunkId(x, y)).orElseGet(() -> {
            Chunk c = newChunk(x, y);
            if (persist)
                c=save(c,true);
            return c;
        });
    }


    public Chunk getOrCreateChunkContent(long x, long y, boolean persist) {
        Chunk c = getOrCreateChunk(x, y, false);
        return c.isFilled() ? c : generateContent(c);
    }

    public Tile getTile(long x, long y, int x_tile, int y_tile) {
        return tileRepository.findById(new TileId(x, y, x_tile, y_tile)).get();
    }

    private Chunk newChunk(long x, long y) {
        System.out.println("Creating Chunk " + x + "/" + y);
        return new Chunk(x, y);
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
                if (!(x == 1 & y == 1))
                    neighborhood[y][x] = getOrCreateChunk(x + c.getX() - 1, y + c.getY() - 1, false);
            }
        }
        return neighborhood;
    }

    private void generateField(Chunk[][] n) {
        Tile[][] field = new Tile[Config.CHUNK_SIZE + 2][Config.CHUNK_SIZE + 2];

        n[1][1].getTiles().forEach(t -> field[t.getY_tile() + 1][t.getX_tile() + 1] = t);

        field[0][0] = n[0][0].getT_lower_right();
        field[0][Config.CHUNK_SIZE + 1] = n[0][2].getT_lower_left();
        field[Config.CHUNK_SIZE + 1][0] = n[2][0].getT_upper_right();
        field[Config.CHUNK_SIZE + 1][Config.CHUNK_SIZE + 1] = n[2][2].getT_upper_left();

        n[0][1].getR_last().forEach(t -> field[0][t.getX_tile() + 1] = t);
        n[1][0].getC_last().forEach(t -> field[t.getY_tile() + 1][0] = t);
        n[2][1].getR_first().forEach(t -> field[Config.CHUNK_SIZE + 1][t.getX_tile() + 1] = t);
        n[1][2].getC_first().forEach(t -> field[t.getY_tile() + 1][Config.CHUNK_SIZE + 1] = t);


        determineValues(field);
        savingService.saveAllNeighbors(n);
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

    public Chunk save(Chunk c, boolean wait) {
        long start = System.currentTimeMillis();
        System.out.println("Saving Chunk " + c.getX() + "/" + c.getY());
        if (wait)
            c = chunkRepository.save(c);
        else
            savingService.save(c);
        return c;
    }


}
