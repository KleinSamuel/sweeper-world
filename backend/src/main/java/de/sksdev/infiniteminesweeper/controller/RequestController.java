package de.sksdev.infiniteminesweeper.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.sksdev.infiniteminesweeper.db.services.ChunkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpOutputMessage;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageHeaders;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.OutputStream;

@Controller
public class RequestController {

    ChunkService chunkService;
    ObjectMapper objectMapper;

    @Autowired
    public RequestController(ObjectMapper objectMapper,
                             ChunkService chunkService) {
        this.objectMapper = objectMapper;
        this.chunkService = chunkService;
    }

    @RequestMapping(value = "/api/getChunk")
    @ResponseBody
    public String getChunk(@RequestParam("x") Long x, @RequestParam("y") Long y) {
        System.out.println("Request for chunk "+x+"/"+y);
        try {
            return objectMapper.writeValueAsString(chunkService.getOrCreateChunk(x,y));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/api/getChunkContent")
    @ResponseBody
    public String getChunkContent(@RequestParam("x") Long x, @RequestParam("y") Long y) {
        System.out.println("Request for chunkContent "+x+"/"+y);
        try {
            return objectMapper.writeValueAsString(chunkService.getOrCreateChunkContent(x,y));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return null;
        }
    }

    @Autowired
    private SimpMessagingTemplate template;

    @GetMapping("/fuckingshit")
    @ResponseBody
    public String teset() {
        String text = "FICKEN ARSCH SAU HURENSOHN";
        template.convertAndSend("/topic/test", text);
        return "FICKEN";
    }

    @MessageMapping("/hello")
    @SendTo("/topic/test")
    public String test() {
        return "Hello World!";
    }

}
