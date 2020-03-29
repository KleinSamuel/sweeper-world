package de.sksdev.infiniteminesweeper.db.entities;

import javax.persistence.*;

@Entity
@Table(name = "archivedseasons")
public class ArchivedSeasons {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column
    private int seasonNumber;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public ArchivedSeasons() {

    }



}
