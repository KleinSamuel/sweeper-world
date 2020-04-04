package de.sksdev.infiniteminesweeper.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.sksdev.infiniteminesweeper.Config;
import de.sksdev.infiniteminesweeper.communication.requests.*;
import de.sksdev.infiniteminesweeper.communication.responses.CellOperationResponse;
import de.sksdev.infiniteminesweeper.communication.responses.LoginResponse;
import de.sksdev.infiniteminesweeper.db.entities.Ids.ChunkId;
import de.sksdev.infiniteminesweeper.db.entities.Ids.TileId;
import de.sksdev.infiniteminesweeper.db.entities.Tile;
import de.sksdev.infiniteminesweeper.db.entities.User;
import de.sksdev.infiniteminesweeper.db.entities.UserStats;
import de.sksdev.infiniteminesweeper.db.services.ChunkService;
import de.sksdev.infiniteminesweeper.db.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Controller
public class RequestController {

    private final ChunkService chunkService;
    private final ObjectMapper objectMapper;
    private final SimpMessagingTemplate template;
    private final UserService userService;
    private final JavaMailSender mailSender;

    @Autowired
    public RequestController(ObjectMapper objectMapper,
                             ChunkService chunkService,
                             SimpMessagingTemplate simpMessagingTemplate,
                             UserService userService, JavaMailSender mailSender) {
        this.objectMapper = objectMapper;
        this.chunkService = chunkService;
        this.template = simpMessagingTemplate;
        this.userService = userService;
        this.mailSender = mailSender;
    }


    @RequestMapping(value = "/api/getChunk", method = RequestMethod.POST)
    @ResponseBody
    public String getChunkContent(@RequestBody ChunkRequest chunkRequest) {
        try {
            if (userService.validateUser(chunkRequest.getUserId(), chunkRequest.getHash())) {
                ChunkId cid = chunkRequest.getChunkId();
                if (!chunkService.registerChunkRequest(cid, chunkRequest.getUserId())) {
                    System.err.println("Chunk loading not permitted! chunk: " + chunkRequest.getChunkX() + ":" + chunkRequest.getChunkY() + " for user " + chunkRequest.getUserId());
                    return null;
                }
                return objectMapper.writeValueAsString(chunkService.getOrCreateChunkContent(cid));
            }
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return null;
    }


    @RequestMapping(value = "/api/getCell", method = RequestMethod.POST)
    @ResponseBody
    public String getTileContent(@RequestBody CellRequest cellRequest) {
        try {
            if (userService.validateUser(cellRequest.getUserId(), cellRequest.getHash())) {
                ChunkId cid = cellRequest.getChunkId();
                if (!cellRequest.isFlag()) {
                    return objectMapper.writeValueAsString(chunkService.openTiles(cid, cellRequest.getCellX(), cellRequest.getCellY(), cellRequest.getUserId()));
                } else {
                    UserStats stats = userService.loadStatsForUser(cellRequest.getUserId());

                    Tile flag = flagCell(new CellOperationRequest(cellRequest, true));
                    if (flag != null) {
                        stats.increaseFlagsSet();
                        stats.increaseCurrentScore(Config.scoreFlag(stats.getStreak()));
                        flag.setFactor(Config.getMultiplicator(stats.getStreak()));
                        flag.setScore(Config.FLAG_SCORE);
                        template.convertAndSend("/stats/id" + cellRequest.getUserId(), stats);
                        return objectMapper.writeValueAsString(flag);
                    } else {
                        stats.resetStreak();
                    }
                    return null;
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
        if (userService.userNameExists(request.getUsername()))
            return "Username already taken!";
        if (userService.emailExists(request.getEmail()))
            return "Email already taken!";

        User user = userService.createNewUser(request.getUsername(), request.getPassword(), chunkService.getRandomTileId(), request.getEmail());

        if (user == null) {
            return "Something went wrong!";
        }
        LoginResponse response = new LoginResponse(user, userService.loadStatsForUser(user.getId()));
        try {
            String resp = objectMapper.writeValueAsString(response);
            sendVerificationMail(user);
            return resp;
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return "Something went wrong!";
    }

    private void sendVerificationMail(User user) {
        String verificationURL = "http://sweeper.world/verify?u=" + user.getId() + "&v=" + user.getVerifier();

        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo(user.getEmail());
        mail.setSubject("Account Verifiation for sweeper.world");
        mail.setText("Click here to verify the account you just created on sweeper.world:\n<a href='" + verificationURL + "'>click here</>");

        //TODO configure mail
//        mailSender.send(mail);
    }

    @RequestMapping(value = "/verify", method = RequestMethod.GET)
    @ResponseBody
    public void verify(@RequestParam("u") int userId, @RequestParam("v") String verifier) {
        User u = userService.getUser(userId);
        try {
            if (u.isVerified())
                return;
        } catch (NullPointerException e) {
            return;
        }
        if (u.getVerifier().equals(verifier)) {
            u.setVerified(true);
            u.setVerifier(null);
        }

        //TODO redirect to login
    }


    @RequestMapping(value = "/login", method = RequestMethod.POST)
    @ResponseBody
    public String login(@RequestBody LoginRequest loginRequest) {
        User user = userService.loginUser(loginRequest.getUsername(), loginRequest.getPassword());

        if (user == null) {
            return (userService.userNameExists(loginRequest.getUsername()) ? "Wrong Password!" : "Username does not exist!");
        }

        LoginResponse response = new LoginResponse(user, userService.loadStatsForUser(user.getId()));
//        user.setHash(response.getHash());

        try {
            return objectMapper.writeValueAsString(response);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return (userService.userNameExists(loginRequest.getUsername()) ? "Wrong Password!" : "Username does not exist!");
    }


    @RequestMapping(value = "/guest", method = RequestMethod.GET)
    @ResponseBody
    public String loginGuest() {
        User user = userService.getGuestUser(UUID.randomUUID().toString(), chunkService.getRandomTileId());
        LoginResponse response = new LoginResponse(user, userService.loadStatsForUser(user.getId()));


        try {
            return objectMapper.writeValueAsString(response);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return "Something went wrong!";
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

    public Tile flagCell(CellOperationRequest message) {

        Tile tile = chunkService.getTile(new TileId(message.getChunkX(), message.getChunkY(), message.getCellX(), message.getCellY()));
        if (tile.getValue() != 9) {
            return null;
        }
        tile = chunkService.registerTileUpdate(tile.getId(), message.getUser(), true);

        if (tile != null) {
            try {
                String response = objectMapper.writeValueAsString(new CellOperationResponse(message, true, Config.FLAG_SCORE, Config.getMultiplicator(userService.loadStatsForUser(message.getUser()).getStreak())));
                template.convertAndSend("/updates/" + message.getChunkX() + "_" + message.getChunkY(), response);
            } catch (JsonProcessingException e) {
                e.printStackTrace();
            }
            return tile;
        } else {
            System.err.println("Update of Tile " + new TileId(message.getChunkX(), message.getChunkY(), message.getCellX(), message.getCellY()) + " by User " + message.getUser() + " was not permitted!");
        }
        return null;
    }

}
