package de.sksdev.infiniteminesweeper.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.sksdev.infiniteminesweeper.db.services.ChunkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RequestController {


    @Autowired
    ChunkService chunkService;

    @Autowired
    ObjectMapper objectMapper;


    @RequestMapping(value = "/api/getChunk")
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
    public String getChunkContent(@RequestParam("x") Long x, @RequestParam("y") Long y) {
        System.out.println("Request for chunkContent "+x+"/"+y);
        try {
            return objectMapper.writeValueAsString(chunkService.getOrCreateChunkContent(x,y));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return null;
        }
    }


}
