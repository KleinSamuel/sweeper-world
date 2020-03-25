package de.sksdev.infiniteminesweeper.db.services;

import de.sksdev.infiniteminesweeper.db.entities.Chunk;
import de.sksdev.infiniteminesweeper.db.entities.Ids.ChunkId;
import de.sksdev.infiniteminesweeper.db.repositories.ChunkRepository;
import javafx.util.Pair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Optional;

@Service
public class ChunkBuffer {

    private HashMap<ChunkId, Pair<Chunk, Long>> buffer;

    final
    ChunkRepository chunkRepository;

    final SavingService savingService;

    @Autowired
    public ChunkBuffer(ChunkRepository chunkRepository, SavingService savingService) {
        buffer = new HashMap<>();
        this.chunkRepository = chunkRepository;
        this.savingService = savingService;
    }

//TODO implement clean up

    public Optional<Chunk> findById(ChunkId id) {
        try {
            return Optional.of(buffer.get(id).getKey());
        } catch (NullPointerException e) {
            return chunkRepository.findById(id);
        }
    }

    public void save(Chunk chunk) {
        buffer(chunk);
        savingService.save(chunk);
    }

    public void saveAll(Iterable<Chunk> chunks) {
        buffer(chunks);
        savingService.saveAll(chunks);
    }

    private void buffer(Iterable<Chunk> chunks) {
        chunks.forEach(this::buffer);
    }

    private Chunk buffer(Chunk chunk) {
        buffer.put(chunk.getId(), new Pair<>(chunk, System.currentTimeMillis()));
        return chunk;
    }
}
