package de.sksdev.infiniteminesweeper.db.services;

import de.sksdev.infiniteminesweeper.db.entities.Ids.ChunkId;
import de.sksdev.infiniteminesweeper.db.entities.User;
import de.sksdev.infiniteminesweeper.db.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;

@Service
public class UserService {

    private UserRepository userRepository;

    private HashMap<ChunkId, HashSet<Long>> loadedChunks;

    private HashSet<Long> loggedIn;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.loadedChunks = new HashMap<>();
        this.loggedIn = new HashSet<>();
    }

    private User getUserById(long id) {
        return userRepository.findById(id).orElseGet(null);
    }

    public User getUser(long id){
        return getUserById(id);
    }

    public boolean isLoggedIn(long uid) {
        return loggedIn.contains(uid);
    }

    private User logIn(long uid) {
        if (isLoggedIn(uid)) {
            System.err.println("User " + uid + " already logged in.");
            return null;
        }
        User u = getUserById(uid);
        if (u != null)
            loggedIn.add(uid);
        return u;
    }

    public boolean validateChunkRequest(long uid, ChunkId cid) {
        try {
            if (isLoggedIn(uid) & !loadedChunks.get(cid).contains(uid))
                return true;
        } catch (NullPointerException ignore) {
        }
        return false;
    }

    public boolean validateTileRequest(long uid, ChunkId cid) {
        try {
            if (isLoggedIn(uid) & loadedChunks.get(cid).contains(uid))
                return true;
        } catch (NullPointerException ignore) {
        }
        return false;
    }

    @PostConstruct
    private void initDummyUser() {
        User u = new User();
        u.setName("Testname");
        userRepository.save(u);
        System.out.println("saving dummy user");
    }

    public boolean registerChunkRequest(ChunkId cid, Long userId) {
        try {
            if (!loadedChunks.get(cid).add(userId))
                return false;
        } catch (NullPointerException e) {
            loadedChunks.put(cid, new HashSet<>(Collections.singletonList(userId)));
        }
        return true;
    }
}
