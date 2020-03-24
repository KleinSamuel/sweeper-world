import { URL_API } from "./Config";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";

export default class Communicator {

    constructor() {
        this.isConnected = false;

        if(!this.client) {
            this.initClient();
        }
    }

    initClient() {
        this.client = new Client();

        let context = this;
        this.client.configure({
            webSocketFactory: function() {
                return new SockJS(URL_API+"/minesweeper");
            },
            onConnect: function(frame) {
                console.log("connected!");
                context.isConnected = true;

                context.client.subscribe("/info/test", function(message){
                    console.log("Got message!");
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

    sendMessage(message) {
        this.client.publish({
            destination: "/report/hello",
            body: message
        });
    }

    requestChunk(chunkX, chunkY) {
        return axios.get(URL_API+"/api/getChunkContent?x="+chunkX+"&y="+chunkY);
    }
}