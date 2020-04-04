package de.sksdev.infiniteminesweeper.db.services;

import de.sksdev.infiniteminesweeper.db.entities.Chunk;
import de.sksdev.infiniteminesweeper.db.repositories.ChunkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.LinkedList;

@Service
public class AsyncService {

    private final ChunkRepository chunkRepository;
    private final UserService userService;
    private LinkedList<Iterable<Chunk>> saveQueue;
    private boolean isSaving = false;

    @Autowired
    public AsyncService(ChunkRepository chunkRepository, UserService userService) {
        this.chunkRepository = chunkRepository;
        this.userService = userService;
        saveQueue = new LinkedList<>();
    }

    @Async
    public void save(Chunk chunk) {
        saveQueue.add(new LinkedList<>(Collections.singletonList(chunk)));
        if (!isSaving)
            saver();
    }

    @Async
    public void saveAll(Iterable<Chunk> chunks) {
        saveQueue.add(chunks);
        if (!isSaving)
            saver();
    }

    public void saver() {
        isSaving = true;
        while (!saveQueue.isEmpty()) {
            chunkRepository.saveAll(saveQueue.getFirst());
            saveQueue.removeFirst();
        }
        isSaving = false;
        System.gc();
    }

}
