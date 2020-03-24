package de.sksdev.infiniteminesweeper.db.services;

import de.sksdev.infiniteminesweeper.db.entities.Chunk;
import de.sksdev.infiniteminesweeper.db.repositories.ChunkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.LinkedList;

@Service
public class SavingService {

    ChunkRepository chunkRepository;

    @Autowired
    public SavingService(ChunkRepository chunkRepository) {
        this.chunkRepository = chunkRepository;
    }

    private long saving;

    @Async
    public void saveAllNeighbors(Chunk[][] n) {
        LinkedList<Chunk> cs = new LinkedList<>();
        long start = System.currentTimeMillis();
        System.out.println("Batch save chunks:");
        for (Chunk[] chunks : n) {
            cs.addAll(Arrays.asList(chunks));
        }
        chunkRepository.saveAll(cs);
        start = System.currentTimeMillis()-start;
        System.out.println("Done: saved "+start+"ms");
    }

    public long getSavingTime() {
        return saving;
    }

    public void save(Chunk c) {
        chunkRepository.save(c);
    }
}
