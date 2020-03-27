package de.sksdev.infiniteminesweeper.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.sksdev.infiniteminesweeper.communication.CellOperationMessage;
import de.sksdev.infiniteminesweeper.communication.LoginResponse;
import de.sksdev.infiniteminesweeper.communication.RegisterRequest;
import de.sksdev.infiniteminesweeper.db.entities.Ids.ChunkId;
import de.sksdev.infiniteminesweeper.db.entities.Ids.TileId;
import de.sksdev.infiniteminesweeper.db.services.ChunkService;
import de.sksdev.infiniteminesweeper.db.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

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

    @RequestMapping(value = "/api/getChunk")
    @ResponseBody
    public String getChunk(@RequestParam("x") Integer x, @RequestParam("y") Integer y) {
        System.out.println("Request for chunk " + x + "/" + y);
        try {
            return objectMapper.writeValueAsString(chunkService.getOrCreateChunk(new ChunkId(x, y)));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/api/getChunkTiles")
    public String getChunkTiles(@RequestParam("u") Long userId, @RequestParam("x") Integer x, @RequestParam("y") Integer y) {
        System.out.println("Request for chunk tiles " + x + "/" + y);
        try {
            ChunkId cid = new ChunkId(x, y);
            if (!chunkService.registerChunkRequest(cid, userId))
                return null;
            return objectMapper.writeValueAsString(chunkService.getOrCreateChunk(cid).getTiles());
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

    @RequestMapping(value = "/api/getChunkContent")
    @ResponseBody
    public String getChunkContent(@RequestParam("x") Integer x, @RequestParam("y") Integer y) {
        try {
            return objectMapper.writeValueAsString(chunkService.getOrCreateChunkContent(x, y, true));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/api/getTile")
    @ResponseBody
    public String getTile(@RequestParam("x") Integer x, @RequestParam("y") Integer y, @RequestParam("x_tile") int x_tile, @RequestParam("y_tile") int y_tile) {
        System.out.println("Request for tile " + x + "/" + y + "(" + x_tile + "/" + y_tile + ")");
        try {
            return objectMapper.writeValueAsString(chunkService.getTile(x, y, x_tile, y_tile));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return null;
        }
    }

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {

        // TODO: create new user in db and send respective hash and id

        LoginResponse response = new LoginResponse();
        response.setHash("some-test-hash");
        response.setId(1);
        try {
            return objectMapper.writeValueAsString(response);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return null;
    }

    @GetMapping("/login")
    public String login(@RequestParam("username") String username, @RequestParam("password") String password) {

        // TODO: check username and password and send respective hash and id
        // hash is used to verify the id

        LoginResponse response = new LoginResponse();
        response.setHash("some-test-hash");
        response.setId(1);
        try {
            return objectMapper.writeValueAsString(response);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        return null;
    }

    @GetMapping("/fuckingshit")
    @ResponseBody
    public String teset() {
        //String text = "FICKEN ARSCH SAU HURENSOHN";
        //template.convertAndSend("/topic/test", text);
        return "FICKEN";
    }

    @MessageMapping("/hello")
    @SendTo("/topic/test")
    public String test() {
        return "Hello World!";
    }

    @MessageMapping("/openCell")
    public String openCell(CellOperationMessage message) {
        return "" + chunkService.registerTileUpdate(new TileId(message.getChunkX(), message.getChunkY(), message.getX(), message.getY()), message.getUser(), false);
    }

    @MessageMapping("/flagCell")
    public String flagCell(CellOperationMessage message) {
        return "" + chunkService.registerTileUpdate(new TileId(message.getChunkX(), message.getChunkY(), message.getX(), message.getY()), message.getUser(), true);
    }
}
