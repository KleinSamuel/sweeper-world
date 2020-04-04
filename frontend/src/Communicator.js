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
    }

    /**
     * Initializes the websocket client and connects to the required channels.
     */
    initClient() {
        let context = this;

        return new Promise(function (resolve, reject) {

            context.client = new Client();
            context.subsriptions = {};

            context.client.configure({
                /* uses SockJS as websocket */
                webSocketFactory: function () {
                    return new SockJS(CONFIG.URL_API + "/minesweeper");
                },
                onConnect: function (frame) {
                    console.log("connected!");
                    context.isConnected = true;
                    resolve();
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
            context.client.activate();
            console.log("[ INFO ] Communicator initialized");
        });
    }

    unregisterChunk(chunkX, chunkY) {
        this.subsriptions[chunkX + "_" + chunkY].unsubscribe();
    }

    registerChunk(chunkX, chunkY, callback) {
        this.subsriptions[chunkX + "_" + chunkY] = this.client.subscribe("/updates/" + chunkX + "_" + chunkY, function (message) {
            let body = JSON.parse(message.body);
            callback(body.chunkX, body.chunkY, body.cellX, body.cellY, body.hidden, body.user, body.value, body.factor);
        });
    }

    receiveLeaderboard(callback) {
        this.test = this.client.subscribe("/leaderboard/id" + CONFIG.getID(), function (message) {
            callback(JSON.parse(message.body));
        });
    }

    receiveStatUpdates(callback) {
        this.test = this.client.subscribe("/stats/id" + CONFIG.getID(), function (message) {
            callback(JSON.parse(message.body));
        });
    }

    getStats() {
        return axios.get(CONFIG.URL_API + "/getStats?u=" + CONFIG.getID() + "&h=" + CONFIG.getHash());
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
        return axios.post(CONFIG.URL_API + "/api/getChunk",{
            chunkX:chunkX,
            chunkY:chunkY,
            userId: CONFIG.getID(),
            hash:CONFIG.getHash(),
        });
    }

    requestCell(chunkX, chunkY, cellX, cellY, flag) {
        return axios.post(CONFIG.URL_API + "/api/getCell",
            {
                userId: CONFIG.getID(),
                hash: CONFIG.getHash(),
                chunkX: chunkX,
                chunkY: chunkY,
                cellX: cellX,
                cellY: cellY,
                flag: flag
            });
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