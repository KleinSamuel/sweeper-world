package de.sksdev.infiniteminesweeper.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.sksdev.infiniteminesweeper.Config;
import de.sksdev.infiniteminesweeper.communication.*;
import de.sksdev.infiniteminesweeper.db.entities.Ids.ChunkId;
import de.sksdev.infiniteminesweeper.db.entities.Ids.TileId;
import de.sksdev.infiniteminesweeper.db.entities.Tile;
import de.sksdev.infiniteminesweeper.db.entities.User;
import de.sksdev.infiniteminesweeper.db.entities.UserSettings;
import de.sksdev.infiniteminesweeper.db.entities.UserStats;
import de.sksdev.infiniteminesweeper.db.services.ChunkService;
import de.sksdev.infiniteminesweeper.db.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Controller
public class RequestController {

    private ChunkService chunkService;
    private ObjectMapper objectMapper;
    private SimpMessagingTemplate template;
    private UserService userService;

    @Autowired
    public RequestController(ObjectMapper objectMapper,
                             ChunkService chunkService,
                             SimpMessagingTemplate simpMessagingTemplate,
                             UserService userService) {
        this.objectMapper = objectMapper;
        this.chunkService = chunkService;
        this.template = simpMessagingTemplate;
        this.userService = userService;
    }

    @RequestMapping(value = "/api/getChunkContent", method = RequestMethod.GET)
    @ResponseBody
    public String getChunkContent(@RequestParam("u") Long userId, @RequestParam(value = "h", required = false) String hash, @RequestParam("x") Integer x, @RequestParam("y") Integer y) {
        try {
            if (userService.validateUser(userId, hash)) {
                ChunkId cid = new ChunkId(x, y);
                if (!chunkService.registerChunkRequest(cid, userId)) {
                    System.err.println("Chunk loading not permitted! chunk: " + x + ":" + y + " for user " + userId);
                    return null;
                }
                return objectMapper.writeValueAsString(chunkService.getOrCreateChunkContent(cid));
            }
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return null;
    }

    @RequestMapping(value = "/api/getTileContent")
    @ResponseBody
    public String getTileContent(@RequestParam("u") Long userId, @RequestParam(value = "h", required = false) String hash, @RequestParam("x") Integer x, @RequestParam("y") Integer y, @RequestParam("x_tile") int x_tile, @RequestParam("y_tile") int y_tile, @RequestParam("f") boolean isFlag) {
        try {
            if (userService.validateUser(userId, hash)) {
                ChunkId cid = new ChunkId(x, y);
                if (!isFlag) {
                    return objectMapper.writeValueAsString(chunkService.openTiles(cid, x_tile, y_tile, userId));
                } else {

                    UserStats stats = userService.loadStatsForUser(userId);

                    boolean isCorrect = flagCell(new CellOperationRequest(x, y, x_tile, y_tile, userId, true));
                    if (isCorrect) {
                        stats.increaseFlagsSet();
                        stats.increaseCurrentScore(Config.scoreFlag(stats.getStreak()));
                    } else {
                        stats.resetStreak();
                    }
                    template.convertAndSend("/stats/id" + userId, stats);
                    return "" + isCorrect;
                }

            }
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return null;
    }


    @RequestMapping(value = "/register", method = RequestMethod.POST)
    @ResponseBody
    public String register(@RequestBody RegisterRequest request) {

        // TODO: check if credentials are valid but maybe check in user service
        User user = userService.createNewUser(request.getUsername(), request.getPassword(), chunkService.getRandomTileId());

        if (user == null) {
            return null;
        }

        LoginResponse response = new LoginResponse(user, null, null);
        try {
            return objectMapper.writeValueAsString(response);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return null;
    }

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    @ResponseBody
    public String login(@RequestBody LoginRequest loginRequest) {

        // TODO: check request for validity
        User user = userService.loginUser(loginRequest.getUsername(), loginRequest.getPassword());

        if (user == null) {
            return null;
        }

        UserSettings userSettings = user.getSettings();
        UserStats userStats = userService.loadStatsForUser(user.getId());
        LoginResponse response = new LoginResponse(user, userSettings, userStats);

        try {
            return objectMapper.writeValueAsString(response);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return null;
    }

    @RequestMapping(value = "/guest", method = RequestMethod.GET)
    @ResponseBody
    public String loginGuest() {

        User user = userService.getGuestUser(UUID.randomUUID().toString(), chunkService.getRandomTileId());
        UserSettings userSettings = user.getSettings();
        UserStats userStats = userService.loadStatsForUser(user.getId());
        LoginResponse response = new LoginResponse(user, userSettings, userStats);

        try {
            return objectMapper.writeValueAsString(response);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return null;
    }

    @RequestMapping(value = "/logout", method = RequestMethod.GET)
    @ResponseBody
    public String logout(@RequestParam("u") long userId) {
        userService.logoutUser(userId);
        return "ok";
    }

    @RequestMapping(value = "/updateSettings", method = RequestMethod.POST)
    @ResponseBody
    public String updateSettings(@RequestBody SettingsRequest settingsRequest) {

        // TODO: check id and hash for validity

        System.out.println("update settings request");
        System.out.println(settingsRequest.getDesign());

        // TODO: only update such requests for non guest users

        boolean wasUpdateable = userService.updateSettings(settingsRequest);

        if (wasUpdateable) {
            return "ok";
        } else {
            return "error";
        }
    }

    @RequestMapping(value = "/getStats", method = RequestMethod.GET)
    @ResponseBody
    public String getStats(@RequestParam("u") long userId, @RequestParam("h") String hash) {
        // TODO: check if user is permitted to load the stats
        UserStats stats = userService.loadStatsForUser(userId);
        try {
            return objectMapper.writeValueAsString(stats);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return null;
    }

    public boolean flagCell(CellOperationRequest message) {

        Tile tile = chunkService.getTile(new TileId(message.getChunkX(), message.getChunkY(), message.getCellX(), message.getCellY()));
        if (tile.getValue() != 9) {
            return false;
        }
        tile = chunkService.registerTileUpdate(tile.getId(), message.getUser(), true);

        if (tile != null) {
            try {
                String response = objectMapper.writeValueAsString(new CellOperationResponse(message, true, tile.getValue()));
                template.convertAndSend("/updates/" + message.getChunkX() + "_" + message.getChunkY(), response);
            } catch (JsonProcessingException e) {
                e.printStackTrace();
            }
        } else
            System.err.println("Update of Tile " + new TileId(message.getChunkX(), message.getChunkY(), message.getCellX(), message.getCellY()) + " by User " + message.getUser() + " was not permitted!");

        return (tile != null);
    }

}
