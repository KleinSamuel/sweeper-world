package de.sksdev.infiniteminesweeper.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.sksdev.infiniteminesweeper.communication.CellOperationMessage;
import de.sksdev.infiniteminesweeper.communication.LoginResponse;
import de.sksdev.infiniteminesweeper.communication.RegisterRequest;
import de.sksdev.infiniteminesweeper.db.entities.Ids.ChunkId;
import de.sksdev.infiniteminesweeper.db.entities.Ids.TileId;
import de.sksdev.infiniteminesweeper.db.entities.User;
import de.sksdev.infiniteminesweeper.db.services.ChunkService;
import de.sksdev.infiniteminesweeper.db.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
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

    @RequestMapping(value = "/api/getChunk", method = RequestMethod.GET)
    @ResponseBody
    public String getChunk(@RequestParam("x") Integer x, @RequestParam("y") Integer y) {
        try {
            return objectMapper.writeValueAsString(chunkService.getOrCreateChunk(new ChunkId(x, y)));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/api/getChunkContent", method = RequestMethod.GET)
    @ResponseBody
    public String getChunkContent(@RequestParam("u") Long userId, @RequestParam("x") Integer x, @RequestParam("y") Integer y) {
        try {
            ChunkId cid = new ChunkId(x, y);
            if (!chunkService.registerChunkRequest(cid, userId)) {
                System.err.println("Chunk loading not permitted!");
                return null;
            }
            return objectMapper.writeValueAsString(chunkService.getOrCreateChunkContent(cid));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return null;
        }

    }
//    @RequestMapping(value="/api/flushBuffer")
//    @ResponseBody
//    public String flushBuffer(){
//        return chunkService.flushBuffer()+"";
//    }

//    @RequestMapping(value = "/api/getChunkContent")
//    @ResponseBody
//    public String getChunkContent(@RequestParam("x") Integer x, @RequestParam("y") Integer y) {
//        try {
//            return objectMapper.writeValueAsString(chunkService.getOrCreateChunkContent(x, y, true));
//        } catch (JsonProcessingException e) {
//            e.printStackTrace();
//            return null;
//        }
//    }

//    @RequestMapping(value = "/api/getTile")
//    @ResponseBody
//    public String getTile(@RequestParam("x") Integer x, @RequestParam("y") Integer y, @RequestParam("x_tile") int x_tile, @RequestParam("y_tile") int y_tile) {
//        System.out.println("Request for tile " + x + "/" + y + "(" + x_tile + "/" + y_tile + ")");
//        try {
//            return objectMapper.writeValueAsString(chunkService.getTile(x, y, x_tile, y_tile));
//        } catch (JsonProcessingException e) {
//            e.printStackTrace();
//            return null;
//        }
//    }

    @RequestMapping(value = "/register", method = RequestMethod.POST)
    @ResponseBody
    public String register(@RequestBody RegisterRequest request) {

        // TODO: create new user in db and send respective hash and id
        User u = userService.getNewUser(request.getUsername());
        if (u == null)
            return null;

        LoginResponse response = new LoginResponse(u.getId());
        userService.logIn(u.getId(), response.getHash());
        try {
            return objectMapper.writeValueAsString(response);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return null;
    }

    @RequestMapping(value = "/login", method = RequestMethod.GET)
    @ResponseBody
    public String login(@RequestParam("username") String username, @RequestParam("password") String password) {

        User u = userService.getExistingUser(username);
        //TODO check pw

        LoginResponse response = new LoginResponse(u.getId());
        userService.logIn(u.getId(), response.getHash());
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
        User g = userService.getNewUser(UUID.randomUUID().toString());
        LoginResponse response = new LoginResponse(g.getId());
        userService.logIn(g.getId(), response.getHash());
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
        return "" + userService.logout(userId);
    }

    @MessageMapping("/openCell")
    @ResponseBody
    public String openCell(CellOperationMessage message) {
        TileId tid = new TileId(message.getChunkX(), message.getChunkY(), message.getCellX(), message.getCellY());
        boolean isValid = chunkService.registerTileUpdate(tid, message.getUser(), false);
        if (isValid) {
            try {
                message.setHidden(false);
                String response = objectMapper.writeValueAsString(message);
                template.convertAndSend("/updates/" + message.getChunkX() + "_" + message.getChunkY(), response);
            } catch (JsonProcessingException e) {
                e.printStackTrace();
            }
        } else
            System.err.println("Update of Tile " + tid + " by User " + message.getUser() + " was not permitted!");

        return "" + isValid;
    }

    @MessageMapping("/flagCell")
    @ResponseBody
    public String flagCell(CellOperationMessage message) {
        TileId tid = new TileId(message.getChunkX(), message.getChunkY(), message.getCellX(), message.getCellY());
        boolean isValid = chunkService.registerTileUpdate(tid, message.getUser(), true);

        if (isValid) {
            try {
                message.setHidden(true);
                String response = objectMapper.writeValueAsString(message);
                template.convertAndSend("/updates/" + message.getChunkX() + "_" + message.getChunkY(), response);
            } catch (JsonProcessingException e) {
                e.printStackTrace();
            }
        } else
            System.err.println("Update of Tile " + tid + " by User " + message.getUser() + " was not permitted!");

        return "" + isValid;
    }
}
