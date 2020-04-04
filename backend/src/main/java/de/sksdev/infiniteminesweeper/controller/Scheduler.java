package de.sksdev.infiniteminesweeper.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.sksdev.infiniteminesweeper.communication.responses.LeaderboardResponse;
import de.sksdev.infiniteminesweeper.db.entities.User;
import de.sksdev.infiniteminesweeper.db.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Map;
import java.util.TreeMap;

@Component
public class Scheduler {

    UserService userService;
    SimpMessagingTemplate template;
    ObjectMapper objectMapper;


    @Autowired
    public Scheduler(UserService userService, SimpMessagingTemplate template, ObjectMapper objectMapper) {
        this.userService = userService;
        this.template = template;
        this.objectMapper = objectMapper;
    }


    @Scheduled(fixedRate = 5000)
    public void updateLeaderboard() {
        ArrayList<Long> topScores = new ArrayList<>(10);
        ArrayList<Long> topUsers = new ArrayList<>(10);
        ArrayList<String> topNames = new ArrayList<>(10);

        TreeMap<Long, User> leaderboard = userService.getCurrentLeaderboard();
        for (Map.Entry<Long, User> scores : leaderboard.descendingMap().entrySet()) {
            topScores.add(scores.getKey());
            topUsers.add(scores.getValue().getId());
            topNames.add(scores.getValue().getName());
            if (topScores.size() == 10)
                break;
        }

        LeaderboardResponse lr = new LeaderboardResponse(topScores, topUsers, topNames);
        leaderboard.descendingMap().forEach((score, user) -> {
            if (user.getId() == topUsers.get(0))
                return;
            broadcastLeaderboard(lr.pushNextEntry(score, user.getId(), user.getName()));
        });
        broadcastLeaderboard(lr.pushNextEntry(0L, -1L, "none"));
    }


    private void broadcastLeaderboard(LeaderboardResponse board) {
        String url = "/leaderboard/id" + board.getOwnUser();
        String response = null;
        try {
            response = objectMapper.writeValueAsString(board);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        template.convertAndSend(url, response);
    }

}
