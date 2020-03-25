package de.sksdev.infiniteminesweeper.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.sksdev.infiniteminesweeper.communication.CellOperationMessage;
import de.sksdev.infiniteminesweeper.db.entities.Chunk;
import de.sksdev.infiniteminesweeper.db.entities.Tile;
import de.sksdev.infiniteminesweeper.db.entities.User;
import de.sksdev.infiniteminesweeper.db.services.ChunkService;
import de.sksdev.infiniteminesweeper.db.services.SavingService;
import de.sksdev.infiniteminesweeper.db.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class RequestController {

    private ChunkService chunkService;
    private ObjectMapper objectMapper;
    private SimpMessagingTemplate template;
    private SavingService savingService;
    private UserService userService;

    @Autowired
    public RequestController(ObjectMapper objectMapper,
                             ChunkService chunkService,
                             SimpMessagingTemplate simpMessagingTemplate,
                             SavingService savingService,
                             UserService userService) {
        this.objectMapper = objectMapper;
        this.chunkService = chunkService;
        this.template = simpMessagingTemplate;
        this.savingService = savingService;
        this.userService = userService;
    }

    @RequestMapping(value = "/api/getChunk")
    @ResponseBody
    public String getChunk(@RequestParam("x") Long x, @RequestParam("y") Long y) {
        System.out.println("Request for chunk "+x+"/"+y);
        try {
            return objectMapper.writeValueAsString(chunkService.getOrCreateChunk(x,y,true));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value="/api/getChunkTiles")
    public String getChunkTiles(@RequestParam("x") Long x, @RequestParam("y") Long y){
        System.out.println("Request for chunk tiles "+x+"/"+y);
        try {
            return objectMapper.writeValueAsString(chunkService.getOrCreateChunk(x,y,true).getTiles());
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return null;
        }

    }

    @RequestMapping(value = "/api/getChunkContent")
    @ResponseBody
    public String getChunkContent(@RequestParam("x") Long x, @RequestParam("y") Long y) {
        try {
            return objectMapper.writeValueAsString(chunkService.getOrCreateChunkContent(x,y,true));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value="/api/getTile")
    @ResponseBody
    public String getTile( @RequestParam("x") Long x, @RequestParam("y") Long y, @RequestParam("x_tile") int x_tile, @RequestParam("y_tile") int y_tile){
        System.out.println("Request for tile "+x+"/"+y + "(" +x_tile+"/"+y_tile+")");
        try {
            return objectMapper.writeValueAsString(chunkService.getTile(x,y,x_tile,y_tile));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return null;
        }
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
    public void openCell(CellOperationMessage message) {

        try {
            Chunk chunk = chunkService.getOrCreateChunkContent(message.getChunkX(), message.getChunkY(), false);
            Tile tile = chunk.getGrid()[message.getX()][message.getY()];

            if (tile.getUser() != null) {
                throw new RuntimeException("tile already owned by another user!");
            }

            User newUser = userService.getUserById(message.getUser());

            if (newUser == null) {
                throw new RuntimeException("user id not valid!");
            }

            tile.setHidden(false);
            tile.setUser(newUser);

        } catch (Exception e){
            System.err.println(e.getMessage());
        }
    }

    @MessageMapping("/flagCell")
    public void flagCell(CellOperationMessage message) {

        try {
            Chunk chunk = chunkService.getOrCreateChunkContent(message.getChunkX(), message.getChunkY(), false);
            Tile tile = chunk.getGrid()[message.getX()][message.getY()];

            if (tile.getUser() != null) {
                throw new RuntimeException("tile already owned by another user!");
            }

            User newUser = userService.getUserById(message.getUser());

            if (newUser == null) {
                throw new RuntimeException("user id not valid!");
            }

            tile.setHidden(true);
            tile.setUser(newUser);

        } catch (Exception e){
            System.err.println(e.getMessage());
        }
    }
}
