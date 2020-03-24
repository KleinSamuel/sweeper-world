package de.sksdev.infiniteminesweeper.db.repositories;

import de.sksdev.infiniteminesweeper.db.entities.Chunk;
import de.sksdev.infiniteminesweeper.db.entities.Ids.ChunkId;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChunkRepository extends CrudRepository<Chunk, ChunkId> {



    Optional<Chunk> findById(ChunkId chunkId);

}
