package de.sksdev.infiniteminesweeper.db.repositories;

import de.sksdev.infiniteminesweeper.db.entities.Ids.TileId;
import de.sksdev.infiniteminesweeper.db.entities.Tile;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TileRepository extends CrudRepository<Tile, TileId>{


    Optional<Tile> findById(TileId tileId);
}
