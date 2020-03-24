import "./css/style.css";

import MinefieldViewer from "./MinefieldViewer";

import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let client = new Client();
client.configure({
    webSocketFactory: function() {
        return new SockJS("http://localhost:8090/backend/minesweeper");
    },
    onConnect: function(frame) {
        console.log("connected!");

        client.publish({
            destination: "/app/hello",
            body: "Hello from client"
        });

        client.subscribe("/topic/test", function(message){
            console.log("Got message!");
            console.log(message);
        });
    },
    onStompError: function(frame) {
        console.log("ERROR!");
        console.log(frame);
    }
});
client.activate();




let viewer = new MinefieldViewer();