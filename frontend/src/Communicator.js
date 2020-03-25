import * as CONFIG from "./Config";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
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

    constructor(userID) {
        this.isConnected = false;

        if (this.userID === undefined) {
            this.userID = userID;
        }

        if(!this.client) {
            this.initClient();
        }
    }

    /**
     * Initializes the websocket client and connects to the required channels.
     */
    initClient() {
        this.client = new Client();

        let context = this;
        this.client.configure({
            /* uses SockJS as websocket */
            webSocketFactory: function() {
                return new SockJS(CONFIG.URL_API+"/minesweeper");
            },
            onConnect: function(frame) {
                console.log("connected!");
                context.isConnected = true;
                /* subscribes to the channel where field updates are released */
                context.client.subscribe("/info/test", function(message){
                    console.log(message);
                });
            },
            onDisconnect: function(frame) {
                console.log("disconnected!");
                context.isConnected = false;
            },
            onStompError: function(frame) {
                console.log("ERROR!");
                console.log(frame);
            }
        });
        this.client.activate();
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
                x: cell.y,
                y: cell.x,
                user: this.userID
            })
        });
    }

    flagCell(cell) {
        this.client.publish({
            destination: "/report/flagCell",
            body: JSON.stringify({
                chunkX: cell.chunkX,
                chunkY: cell.chunkY,
                x: cell.y,
                y: cell.x,
                user: this.userID
            })
        });
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
        return new Promise(function(resolve, reject) {
            setTimeout(function(){
                resolve();
            }, 100);
        }).then(function(){
            return axios.get(CONFIG.URL_API+"/api/getChunkContent?x="+chunkX+"&y="+chunkY)
        });
    }
}