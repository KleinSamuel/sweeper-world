import * as CONFIG from "./Config";
import SockJS from "sockjs-client";
import {Client} from "@stomp/stompjs";
import axios from "axios";

/**
 * Class handles all communications with the server.
 * This client app is able to talk to the server with HTTP requests
 * or through a websocket connection which is used to inform the client
 * about updates of the field.
 *
 * @author Samuel Klein
 */
export default class Communicator {

    constructor() {
        this.isConnected = false;

        if (!this.client) {
            this.initClient();
        }
    }

    /**
     * Initializes the websocket client and connects to the required channels.
     */
    initClient() {
        this.client = new Client();
        this.subsriptions = {};

        let context = this;
        this.client.configure({
            /* uses SockJS as websocket */
            webSocketFactory: function () {
                return new SockJS(CONFIG.URL_API + "/minesweeper");
            },
            onConnect: function (frame) {
                console.log("connected!");
                context.isConnected = true;
            },
            onDisconnect: function (frame) {
                console.log("disconnected!");
                context.isConnected = false;
            },
            onStompError: function (frame) {
                console.log("ERROR!");
                console.log(frame);
            }
        });
        this.client.activate();
        console.log("[ INFO ] Communicator initialized");
    }

    unregisterChunk(chunkX, chunkY) {
        this.subsriptions[chunkX + "_" + chunkY].unsubscribe();
    }

    registerChunk(chunkX, chunkY, callback) {
        this.subsriptions[chunkX + "_" + chunkY] = this.client.subscribe("/updates/" + chunkX + "_" + chunkY, function (message) {
            let body = JSON.parse(message.body);
            console.log(body)
            // if (body.user !== CONFIG.getID()) {

            callback(body.chunkX, body.chunkY, body.cellX, body.cellY, body.hidden, body.user, body.value);
            // }
        });
    }

    /**
     * Sends a message via the socket connection to the server.
     * @param message
     */
    sendMessage(message) {
        this.client.publish({
            destination: "/report/hello",
            body: message
        });
    }

    openCell(cell) {
        this.client.publish({
            destination: "/report/openCell",
            body: JSON.stringify({
                chunkX: cell.chunkX,
                chunkY: cell.chunkY,
                cellX: cell.cellX,
                cellY: cell.cellY,
                user: CONFIG.getID()
            })
        });
    }

    flagCell(cell) {
        this.client.publish({
            destination: "/report/flagCell",
            body: JSON.stringify({
                chunkX: cell.chunkX,
                chunkY: cell.chunkY,
                cellX: cell.cellX,
                cellY: cell.cellY,
                user: CONFIG.getID()
            })
        });
    }

    loginUser(username, password) {
        return axios.post(CONFIG.URL_API + "/login", {
            username: username,
            password: password
        });
    }

    registerUser(username, password, email) {
        return axios.post(CONFIG.URL_API + "/register", {
            username: username,
            password: password,
            email: email
        });
    }

    loginGuest() {
        return axios.get(CONFIG.URL_API + "/guest");
    }

    logout() {
        return axios.get(CONFIG.URL_API + "/logout?u=" + CONFIG.getID());
    }

    /**
     * Requests a cell chunk at given coordinates from the server and returns
     * the promise which contains the response.
     *
     * @param chunkX x coordinate of the chunk
     * @param chunkY y coordinate of the chunk
     * @returns {Promise<T>}
     */
    requestChunk(chunkX, chunkY) {
        return axios.get(CONFIG.URL_API + "/api/getChunkContent?u=" + CONFIG.getID() + "&h=" + CONFIG.getHash() + "&x=" + chunkX + "&y=" + chunkY);
    }

    requestCell(chunkX, chunkY, cellX, cellY) {
        return axios.get(CONFIG.URL_API + "/api/getTileContent?u=" + CONFIG.getID() + "&h=" + CONFIG.getHash() + "&x=" + chunkX + "&y=" + chunkY + "&x_tile=" + cellX + "&y_tile=" + cellY);
    }

    updateSettings(design, soundsEnabled) {
        return axios.post(CONFIG.URL_API + "/updateSettings", {
            id: CONFIG.getID(),
            hash: CONFIG.getHash(),
            design: design,
            soundsEnabled: soundsEnabled
        });
    }
}