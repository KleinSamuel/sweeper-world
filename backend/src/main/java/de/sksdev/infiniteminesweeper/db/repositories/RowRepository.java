package de.sksdev.infiniteminesweeper.db.repositories;

import de.sksdev.infiniteminesweeper.db.entities.Row;
import de.sksdev.infiniteminesweeper.db.entities.Ids.RowId;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RowRepository extends CrudRepository<Row, RowId> {

    @Override
    Optional<Row> findById(RowId rowId);
}
