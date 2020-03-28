package de.sksdev.infiniteminesweeper.db.services;

import de.sksdev.infiniteminesweeper.Config;
import de.sksdev.infiniteminesweeper.db.entities.Ids.ChunkId;
import de.sksdev.infiniteminesweeper.db.entities.Ids.TileId;
import de.sksdev.infiniteminesweeper.db.entities.Tile;
import de.sksdev.infiniteminesweeper.db.entities.User;
import de.sksdev.infiniteminesweeper.db.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Random;

@Service
public class UserService {

    private UserRepository userRepository;

    private HashMap<ChunkId, HashSet<Long>> loadedChunks;

    private HashMap<Long, String> loggedIn;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.loadedChunks = new HashMap<>();
        this.loggedIn = new HashMap<>();
    }

    private User getUserById(long id) {
        return userRepository.findById(id).orElseGet(null);
    }

    protected User getUser(long id) {
        return getUserById(id);
    }

    private User save(User u) {
        return userRepository.save(u);
    }

    private User getUser(String name) {
        return userRepository.findByName(name);
    }

    public User getExistingUser(String name) {
        User u = getUser(name);
        return isLoggedIn(u.getId()) ? null : u;
    }

    private User createUser(String name, TileId start) {
        try {
            if(name.length()>32)
                name= name.replaceAll("-","").substring(0,31);
            return (save(new User(name, start)));
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Shitty name for a User: '" + name + "'");
        }
        return null;
    }


    public User getNewUser(String name, TileId start) {
        User u = getUser(name);
        return u != null ? u : createUser(name, start);
    }

    public boolean isLoggedIn(long uid) {
        boolean l = loggedIn.containsKey(uid);
        if (!l)
            System.err.println("User " + uid + " is not logged in!");
        return l;
    }

    public void logIn(long uid, String hash) {
        if (isLoggedIn(uid)) {
            System.err.println("User " + uid + " already logged in.");
            return;
        }
        User u = getUserById(uid);
        if (u != null)
            loggedIn.put(uid, hash);
    }

    public boolean validateChunkRequest(long uid, ChunkId cid) {
//        try {
        if (isLoggedIn(uid)/* & !loadedChunks.get(cid).contains(uid)*/)
            return true;
//        } catch (NullPointerException ignore) {
//            return true;
//        }
//        System.err.println("User " + uid + " may already have requested chunk " + cid + " !");
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

//    @PostConstruct
//    private void initDummyUser() {
//        User u = new User();
//        u.setName("Testname");
//        System.out.println("saving dummy user");
//        userRepository.save(u);
//    }

    public boolean registerChunkRequest(ChunkId cid, Long userId) {
        try {
            if (!loadedChunks.get(cid).add(userId))
//                return false;
                return true;
        } catch (NullPointerException e) {
            loadedChunks.put(cid, new HashSet<>(Collections.singletonList(userId)));
        }
        return true;
    }

    public boolean logout(long userId) {
        return loggedIn.remove(userId) != null;
    }
}
