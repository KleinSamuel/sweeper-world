package de.sksdev.infiniteminesweeper.db.services;

import de.sksdev.infiniteminesweeper.Config;
import de.sksdev.infiniteminesweeper.db.entities.Chunk;
import de.sksdev.infiniteminesweeper.db.entities.Ids.ChunkId;
import de.sksdev.infiniteminesweeper.db.entities.Tile;
import de.sksdev.infiniteminesweeper.db.entities.User;
import de.sksdev.infiniteminesweeper.db.repositories.ChunkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.TreeSet;

@Service
public class AsyncService {


    final
    ChunkRepository chunkRepository;

    final UserService userService;

    //TODO intelligent queue (maybe 2 TreeSet queues (one used one not)), -> bulk save & not duplicate saving
    LinkedList<Iterable<Chunk>> saveQueue;
    boolean isSaving = false;

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

//    @Async
//    public void openTiles(Chunk chunk, Tile t, User user) {
//        HashMap<ChunkId, TreeSet<Tile>> openedTiles = new HashMap<>();
//        recOpenTiles(chunk,t, openedTiles);
//        HashMap<Integer, HashMap<Integer, HashMap<Integer, HashMap<Integer, Tile>>>> tileMap = new HashMap<>();
//        openedTiles.forEach((c, ts) -> {
//            userService.registerChunkRequest(c, userId.getId();
//            if (!tileMap.containsKey(c.getX()))
//                tileMap.put(c.getX(), new HashMap<>());
//            if (!tileMap.get(c.getX()).containsKey(c.getY()))
//                tileMap.get(c.getX()).put(c.getY(), new HashMap<>());
//            HashMap<Integer, HashMap<Integer, Tile>> openedChunk = tileMap.get(c.getX()).get(c.getY());
//            ts.forEach(open -> {
//                if (!openedChunk.containsKey(open.getX_tile()))
//                    openedChunk.put(open.getX_tile(), new HashMap<>());
//                openedChunk.get(open.getX_tile()).put(open.getY_tile(), open);
//                open.setHidden(false);
//                open.setUser(u);
//            });
//        });
//    }
//
//    public void recOpenTiles(Chunk c, int x_tile, int y_tile, HashMap<ChunkId, TreeSet<Tile>> opened) {
//        recOpenTiles(c,c.getGrid()[y_tile][x_tile], opened);
//    }
//
//    public void recOpenTiles(Chunk startChunk, Tile t, HashMap<ChunkId, TreeSet<Tile>> opened) {
//        boolean alreadyOpened = false;
//        ChunkId cid = t.getChunk().getId();
//        try {
//            alreadyOpened = !opened.get(cid).add(t);
//        } catch (NullPointerException e) {
//            opened.put(cid, new TreeSet<>(Collections.singletonList(t)));
//        }
//
//        if (!alreadyOpened) {
//            if (t.getValue() < 1) {
//                Chunk c;
//                for (int yo = -1; yo < 2; yo++) {
//                    c = startChunk;
//                    int y = t.getY_tile() + yo;
//                    Tile[] row;
//                    try {
//                        row = c.getGrid()[y];
//                    } catch (IndexOutOfBoundsException ey) {
//
//                        if (y < 0) {
//                            c = getOrCreateChunkContent(new ChunkId(t.getX(), t.getY() + 1));
//                            row = c.getGrid()[Config.CHUNK_SIZE - 1];
//                            y = Config.CHUNK_SIZE - 1;
//                        } else {
//                            c = getOrCreateChunkContent(new ChunkId(t.getX(), t.getY() - 1));
//                            row = c.getGrid()[0];
//                            y = 0;
//                        }
//                    }
//                    for (int xo = -1; xo < 2; xo++) {
//                        if (yo == 0 && xo == 0)
//                            continue;
//
//                        int x = t.getX_tile() + xo;
//                        try {
//                            recOpenTiles(c,row[x], opened);
//                        } catch (IndexOutOfBoundsException e) {
//                            if (x < 0) {
//                                recOpenTiles(getOrCreateChunkContent(new ChunkId(c.getX() - 1, c.getY())),Config.CHUNK_SIZE - 1, y, opened);
//                            } else {
//                                recOpenTiles(getOrCreateChunkContent(new ChunkId(c.getX() + 1, c.getY())),0, y, opened);
//                            }
//                        }
//                    }
//                }
//            }
//        }
//    }

//    @Async
//    public void sendTileUpdate(ChunkId cid, Tile t){
//        template.convertAndSend("/topic/test", text);
//    }

}
