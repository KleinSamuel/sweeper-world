package de.sksdev.infiniteminesweeper.db.services;

import de.sksdev.infiniteminesweeper.db.entities.Chunk;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SavingService {


    AsyncSavingService asyncSavingService;

    @Autowired
    public SavingService(AsyncSavingService asyncSavingService) {
        this.asyncSavingService = asyncSavingService;
    }

    public void saveAll(Iterable<Chunk> chunks) {
        asyncSavingService.saveAll(chunks);
    }

    public void save(Chunk chunk) {
        asyncSavingService.save(chunk);
    }


}
