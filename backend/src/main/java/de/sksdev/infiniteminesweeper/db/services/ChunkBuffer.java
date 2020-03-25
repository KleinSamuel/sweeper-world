package de.sksdev.infiniteminesweeper.db.services;

import de.sksdev.infiniteminesweeper.Config;
import de.sksdev.infiniteminesweeper.db.entities.Chunk;
import de.sksdev.infiniteminesweeper.db.entities.Ids.ChunkId;
import de.sksdev.infiniteminesweeper.db.repositories.ChunkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ChunkBuffer {

    private HashMap<ChunkId, Chunk> buffer;

    private TreeSet<BufferedChunk> stack;

    final
    ChunkRepository chunkRepository;

    final SavingService savingService;

    final AsyncService asyncService;

    @Autowired
    public ChunkBuffer(ChunkRepository chunkRepository, SavingService savingService, AsyncService asyncService) {
        buffer = new HashMap<>();
        stack = new TreeSet<>();
        this.chunkRepository = chunkRepository;
        this.savingService = savingService;
        this.asyncService = asyncService;
    }

    public Optional<Chunk> findById(ChunkId id) {
        try {
            return Optional.of(buffer.get(id));
        } catch (NullPointerException e) {
            return chunkRepository.findById(id);
        }
    }

    public void save(Chunk chunk) {
        buffer(chunk.getBuffer());
//        savingService.save(chunk);
    }

    public void saveAll(Iterable<Chunk> chunks) {
        buffer(chunks);
//        savingService.saveAll(chunks);
    }

    private void buffer(Iterable<Chunk> chunks) {
        chunks.forEach(c -> buffer(c.getBuffer()));
    }

    private void buffer(BufferedChunk b) {
        b.update();
        if (!b.getChunk().isBuffered()) {
            buffer.put(b.getChunk().getId(), b.getChunk());
        } else {
            stack.remove(b);
        }
        stack.add(b);

    }

    @Scheduled(fixedRate = Config.BUFFER_REMOVAL / 2)
    public void executeBufferCleaner() {
        System.out.println("Cleaner:start\tBuffer Size = " + buffer.size());
        if (Config.BUFFERD_CHUNK_CAP <= buffer.size()) {
            System.out.print("Cleaner:run");
            HashSet<Chunk> chunks = runBufferCleaner(stack, buffer);
            System.out.println(" removing " + chunks.size() + " Chunks");
            asyncService.saveAll(chunks);
            System.out.println("Cleaner:done\tBuffer Size = " + buffer.size());
        } else {
            System.out.println("Cleaner:done -> nothing to remove");
        }
    }

    public HashSet<Chunk> runBufferCleaner(TreeSet<BufferedChunk> stack, HashMap<ChunkId, Chunk> buffer) {
        Iterator<BufferedChunk> it = stack.iterator();
        HashSet<Chunk> chunks = new HashSet<>();
        while (it.hasNext()) {
            BufferedChunk bc = it.next();
            if (System.currentTimeMillis() - bc.getTimestamp() > Config.CHUNK_SIZE) {
                chunks.add(bc.getChunk());
            } else
                break;
        }
        chunks.forEach(c -> {
            try {
                buffer.remove(c.getId()).getBuffer();
            }catch(NullPointerException e){
                System.err.println("Could not remove Chunk "+c.getId());
            }
            stack.remove(c.getBuffer());
        });
        return chunks;
    }
}
