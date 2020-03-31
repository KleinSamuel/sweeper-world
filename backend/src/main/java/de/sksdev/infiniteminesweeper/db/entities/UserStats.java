package de.sksdev.infiniteminesweeper.db.entities;

import javax.persistence.*;

@Entity
@Table(name = "userstats")
public class UserStats {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(unique = true)
    private long userid;

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

    public UserStats(long userId) {
        this.userid = userId;
        this.streak = 0;
        this.currentScore = 0;
        this.currentCellsOpened = 0;
        this.currentBombsExploded = 0;
        this.currentFlagsSet = 0;
        this.currentLongestStreak = 0;
        this.totalScore = 0;
        this.totalCellsOpened = 0;
        this.totalBombsExploded = 0;
        this.totalFlagsSet = 0;
        this.totalLongestStreak = 0;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getUserid() {
        return userid;
    }

    public void setUserid(long userid) {
        this.userid = userid;
    }

    public int getStreak() {
        return streak;
    }

    public void setStreak(int streak) {
        this.streak = streak;
    }

    public long getCurrentScore() {
        return currentScore;
    }

    public void setCurrentScore(long currentScore) {
        this.currentScore = currentScore;
    }

    public int getCurrentCellsOpened() {
        return currentCellsOpened;
    }

    public void setCurrentCellsOpened(int currentCellsOpened) {
        this.currentCellsOpened = currentCellsOpened;
    }

    public int getCurrentBombsExploded() {
        return currentBombsExploded;
    }

    public void setCurrentBombsExploded(int currentBombsExploded) {
        this.currentBombsExploded = currentBombsExploded;
    }

    public int getCurrentFlagsSet() {
        return currentFlagsSet;
    }

    public void setCurrentFlagsSet(int currentFlagsSet) {
        this.currentFlagsSet = currentFlagsSet;
    }

    public int getCurrentLongestStreak() {
        return currentLongestStreak;
    }

    public void setCurrentLongestStreak(int currentLongestStreak) {
        this.currentLongestStreak = currentLongestStreak;
    }

    public long getTotalScore() {
        return totalScore;
    }

    public void setTotalScore(long totalScore) {
        this.totalScore = totalScore;
    }

    public int getTotalCellsOpened() {
        return totalCellsOpened;
    }

    public void setTotalCellsOpened(int totalCellsOpened) {
        this.totalCellsOpened = totalCellsOpened;
    }

    public int getTotalBombsExploded() {
        return totalBombsExploded;
    }

    public void setTotalBombsExploded(int totalBombsExploded) {
        this.totalBombsExploded = totalBombsExploded;
    }

    public int getTotalFlagsSet() {
        return totalFlagsSet;
    }

    public void setTotalFlagsSet(int totalFlagsSet) {
        this.totalFlagsSet = totalFlagsSet;
    }

    public int getTotalLongestStreak() {
        return totalLongestStreak;
    }

    public void setTotalLongestStreak(int totalLongestStreak) {
        this.totalLongestStreak = totalLongestStreak;
    }

    public void increaseStreak() {
        this.streak += 1;
        if (this.streak > this.currentLongestStreak) {
            this.currentLongestStreak = this.streak;
        }
        if (this.streak > this.totalLongestStreak) {
            this.totalLongestStreak = this.streak;
        }
    }

    public void resetStreak() {
        this.streak = 0;
    }

    public void increaseCurrentScore(long toAdd) {
        this.currentScore += toAdd;
        this.totalScore += toAdd;
    }

    public void increaseCellsOpened() {
        this.currentCellsOpened += 1;
        this.totalCellsOpened += 1;
    }

    public void increaseBombsExploded() {
        this.currentBombsExploded += 1;
        this.totalBombsExploded += 1;
    }

    public void increaseFlagsSet() {
        this.currentFlagsSet += 1;
        this.totalFlagsSet += 1;
    }
}
