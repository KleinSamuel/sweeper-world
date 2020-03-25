package de.sksdev.infiniteminesweeper.db.services;

import de.sksdev.infiniteminesweeper.db.entities.Chunk;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SavingService {


    AsyncService asyncService;

    @Autowired
    public SavingService(AsyncService asyncService) {
        this.asyncService = asyncService;
    }

    public void saveAll(Iterable<Chunk> chunks) {
        asyncService.saveAll(chunks);
    }

    public void save(Chunk chunk) {
        asyncService.save(chunk);
    }


}
