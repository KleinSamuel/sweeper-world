package de.sksdev.infiniteminesweeper.db.entities;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "chunks")
public class Chunk {

    @Embeddable
    public class ChunkId implements Serializable {
        private long x;
        private long y;
    }

    @Id
    private ChunkId id;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumns({
        @JoinColumn(name="x"),
        @JoinColumn(name="y")
    })
    private RowStore rows;

    public ChunkId getId() {
        return id;
    }

    public void setId(ChunkId id) {
        this.id = id;
    }

    public RowStore getRows() {
        return rows;
    }

    public void setRows(RowStore rows) {
        this.rows = rows;
    }
}
