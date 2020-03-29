package de.sksdev.infiniteminesweeper.db.entities;

import javax.persistence.*;

@Entity
@Table(name = "userstats")
public class UserStats {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @OneToOne
    private User user;

    // temporary stats for the user
    @Column
    private int streak;

    // stats for the current season
    @Column
    private long currentScore;
    @Column
    private int currentCellsOpened;
    @Column
    private int currentBombsExploded;
    @Column
    private int currentFlagsSet;
    @Column
    private int currentLongestStreak;

    // accumulated stats over all seasons
    @Column
    private long totalScore;
    @Column
    private int totalCellsOpened;
    @Column
    private int totalBombsExploded;
    @Column
    private int totalFlagsSet;
    @Column
    private int totalLongestStreak;

    public UserStats() {

    }

    public UserStats(User user) {
        this.user = user;
    }

}
