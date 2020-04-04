package de.sksdev.infiniteminesweeper.communication.responses;

import java.util.ArrayList;

public class LeaderboardResponse {

    int ownPos;

    ArrayList<Long> topScores;
    ArrayList<Long> topUsers;
    ArrayList<String> topNames;

    long nextScore;
    long ownScore;
    long lastScore;

    long nextUser;
    long ownUser;
    long lastUser;

    String nextName;
    String ownName;
    String lastName;


    public LeaderboardResponse(ArrayList<Long> topScores, ArrayList<Long> topUsers, ArrayList<String> topNames) {
        this.topScores = topScores;
        this.topUsers = topUsers;
        this.topNames = topNames;
        this.ownPos = 0;

        try {
            lastScore = topScores.get(0);
            lastUser = topUsers.get(0);
            lastName = topNames.get(0);
        } catch (IndexOutOfBoundsException ignore) {

        }
    }

    public ArrayList<Long> getTopScores() {
        return topScores;
    }

    public void setTopScores(ArrayList<Long> topScores) {
        this.topScores = topScores;
    }

    public ArrayList<Long> getTopUsers() {
        return topUsers;
    }

    public void setTopUsers(ArrayList<Long> topUsers) {
        this.topUsers = topUsers;
    }

    public ArrayList<String> getTopNames() {
        return topNames;
    }

    public void setTopNames(ArrayList<String> topNames) {
        this.topNames = topNames;
    }

    public long getNextScore() {
        return nextScore;
    }

    public void setNextScore(long nextScore) {
        this.nextScore = nextScore;
    }

    public long getOwnScore() {
        return ownScore;
    }

    public void setOwnScore(long ownScore) {
        this.ownScore = ownScore;
    }

    public long getLastScore() {
        return lastScore;
    }

    public void setLastScore(long lastScore) {
        this.lastScore = lastScore;
    }

    public long getNextUser() {
        return nextUser;
    }

    public void setNextUser(long nextUser) {
        this.nextUser = nextUser;
    }

    public long getLastUser() {
        return lastUser;
    }

    public void setLastUser(long lastUser) {
        this.lastUser = lastUser;
    }

    public String getNextName() {
        return nextName;
    }

    public void setNextName(String nextName) {
        this.nextName = nextName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public long getOwnUser() {
        return ownUser;
    }

    public void setOwnUser(long ownUser) {
        this.ownUser = ownUser;
    }

    public String getOwnName() {
        return ownName;
    }

    public void setOwnName(String ownName) {
        this.ownName = ownName;
    }

    public LeaderboardResponse pushNextEntry(Long score, Long id, String name) {
        setNextScore(getOwnScore());
        setNextName(getOwnName());
        setNextUser(getOwnUser());

        setOwnName(getLastName());
        setOwnScore(getLastScore());
        setOwnUser(getLastUser());

        setLastName(name);
        setLastScore(score);
        setLastUser(id);
        ownPos++;
        return this;
    }

    public int getOwnPos() {
        return ownPos;
    }

    public void setOwnPos(int ownPos) {
        this.ownPos = ownPos;
    }
}
