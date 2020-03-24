package de.sksdev.infiniteminesweeper.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import de.sksdev.infiniteminesweeper.db.entities.Chunk;
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
    public String getChunkContent(@RequestParam("x") Long x, @RequestParam("y") Long y) {
        System.out.println("Request for chunkContent "+x+"/"+y);
        try {
            long time = System.currentTimeMillis();
            Chunk c = chunkService.getOrCreateChunkContent(x,y,true);
            time = System.currentTimeMillis()-time;
            long saving = chunkService.getSavingTime();
            System.out.println("Saving: "+saving +"ms ("+(int)(saving/(time/100d))+"%)");
            System.out.println("Total: "+time+"ms");
            return objectMapper.writeValueAsString(c);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value="/api/getTile")
    public String getTile( @RequestParam("x") Long x, @RequestParam("y") Long y, @RequestParam("x_tile") int x_tile, @RequestParam("y_tile") int y_tile){
        System.out.println("Request for tile "+x+"/"+y + "(" +x_tile+"/"+y_tile+")");
        try {
            return objectMapper.writeValueAsString(chunkService.getTile(x,y,x_tile,y_tile));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return null;
        }
    }


}
