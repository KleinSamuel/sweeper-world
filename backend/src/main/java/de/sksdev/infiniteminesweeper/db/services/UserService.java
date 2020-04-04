package de.sksdev.infiniteminesweeper.db.services;

import de.sksdev.infiniteminesweeper.Authenticator;
import de.sksdev.infiniteminesweeper.communication.requests.SettingsRequest;
import de.sksdev.infiniteminesweeper.db.entities.Ids.ChunkId;
import de.sksdev.infiniteminesweeper.db.entities.Ids.TileId;
import de.sksdev.infiniteminesweeper.db.entities.User;
import de.sksdev.infiniteminesweeper.db.entities.UserSettings;
import de.sksdev.infiniteminesweeper.db.entities.UserStats;
import de.sksdev.infiniteminesweeper.db.repositories.UserRepository;
import de.sksdev.infiniteminesweeper.db.repositories.UserStatsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserStatsRepository userStatsRepository;
    private HashMap<ChunkId, HashSet<Long>> loadedChunks;
    private HashMap<Long, User> buffer;
    private HashMap<Long, UserStats> stats;
    private Authenticator authenticator;

    @Autowired
    public UserService(UserRepository userRepository, UserStatsRepository userStatsRepository) {
        this.userRepository = userRepository;
        this.userStatsRepository = userStatsRepository;
        this.loadedChunks = new HashMap<>();
        this.buffer = new HashMap<>();
        this.stats = new HashMap<>();
        this.authenticator = new Authenticator();
    }

    public UserStats loadStatsForUser(long userId) {
        if (this.stats.containsKey(userId)) {
            return this.stats.get(userId);
        }
        Optional<UserStats> statOpt = userStatsRepository.findByUserid(userId);
        if (statOpt.isPresent()) {
            UserStats stats = statOpt.get();
            this.stats.put(userId, stats);
            return stats;
        }
        UserStats stats = userStatsRepository.save(new UserStats(userId));
        this.stats.put(userId, stats);
        return stats;
    }

    public TreeMap<Long, User> getCurrentLeaderboard() {
        TreeMap<Long, User> leaderboard = new TreeMap<>();
        buffer.forEach((id, user) -> leaderboard.put(loadStatsForUser(id).getCurrentScore(), user));
        return leaderboard;
    }

    public User createNewUser(String username, String password, TileId id) {
        // TODO: check if username and password is malformed
        if (userNameExists(username))
            return null;
        User user = new User(username, authenticator.hash(password.toCharArray()), false, id);
        userRepository.save(user);
        return user;
    }

    private boolean userNameExists(String username) {
        return userRepository.findByName(username).isPresent();
    }

    /**
     * Creates and returns a new guest user object which contains a random name,
     *
     * @param name
     * @param tileId
     * @return
     */
    public User getGuestUser(String name, TileId tileId) {
        try {
            if (name.length() > 32) {
                name = name.replaceAll("-", "").substring(0, 31);
            }
            User user = userRepository.save(new User(name, authenticator.hash(name.toCharArray()), true, tileId));
            user.setName("Guest#" + user.getId());
            user = userRepository.save(user);
            this.buffer.put(user.getId(), user);
            return user;
        } catch (Exception e) {
            System.err.println("Could not create new guest user.");
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Fetches a user object by username and password from the database, puts it into the
     * user buffer and returns the object. Returns null if the provided userdata
     * is wrong or if the the user is already logged in.
     *
     * @param username
     * @param password
     * @return
     */
    public User loginUser(String username, String password) {
        Optional<User> userOpt = userRepository.findByName(username);

        if (userOpt.isEmpty() || isLoggedIn(userOpt.get().getId())) {
            return null;
        }
        User user = userOpt.get();
        if (!authenticator.authenticate(password.toCharArray(), user.getToken()))
            return null;
        putIntoBuffer(user);
        loadStatsForUser(user.getId());
        return user;
    }

    /**
     * Returns true if the user with the given id is currently logged in (in buffer)
     *
     * @param id
     * @return
     */
    public boolean isLoggedIn(long id) {
        return this.buffer.containsKey(id);
    }

    /**
     * Removes the user with the given user id from the buffer and stores
     * it into the database.
     *
     * @param id
     */
    public void logoutUser(long id) {
        User user = this.buffer.remove(id);
        UserStats userStats = this.stats.remove(id);
        if (user != null) {
            userRepository.save(user);
            userStatsRepository.save(userStats);
        }
    }

    /**
     * Returns the user object for a given user id.
     *
     * @param id
     * @return
     */
    public User getUser(long id) {
        return loadUserIntoBuffer(id);
    }

    /**
     * Checks if the requested user is already in the buffer, if no it will be loaded
     * from the database and put into the buffer, and returns the user object.
     *
     * @param id
     * @return
     */
    private User loadUserIntoBuffer(long id) {

        if (this.buffer.containsKey(id)) {
            return this.buffer.get(id);
        }

        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            System.err.println("UserBuffer could not load user with id: " + id);
            return null;
        }
        User user = userOpt.get();
        putIntoBuffer(user);
        return user;
    }

    /**
     * Stores the provided user object in the buffer for currently logged in users
     *
     * @param user
     */
    private void putIntoBuffer(User user) {
        this.buffer.put(user.getId(), user);
    }

    public boolean updateSettings(SettingsRequest settingsRequest) {
        User user = getUser(settingsRequest.getId());
        if (user == null) {
            return false;
        }
        UserSettings userSettings = user.getSettings();
        userSettings.setDesign(settingsRequest.getDesign());
        userSettings.setSoundsEnabled(settingsRequest.isSoundsEnabled());
        return true;
    }

    public boolean validateChunkRequest(long uid, ChunkId cid) {
        return isLoggedIn(uid);
    }

    public boolean validateTileRequest(long uid, ChunkId cid) {
        try {
            if (isLoggedIn(uid) & loadedChunks.get(cid).contains(uid)) {
                return true;
            }
        } catch (NullPointerException ignore) {
        }
        return false;
    }

    public boolean registerChunkRequest(ChunkId cid, Long userId) {
        try {
            if (!loadedChunks.get(cid).add(userId))
//                return false;
                return true;
        } catch (NullPointerException e) {
            loadedChunks.put(cid, new HashSet<>(Collections.singletonList(userId)));
//            return false;
        }
        return true;
    }

    public boolean validateUser(Long userId, String hash) {
        return buffer.get(userId).getHash().equals(hash);
    }
}
