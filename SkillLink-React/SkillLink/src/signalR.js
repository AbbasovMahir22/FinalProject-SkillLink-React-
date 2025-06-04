// SignalR.js
import { HubConnectionBuilder } from "@microsoft/signalr";

let connection = null;

export const startConnection = (token, onNotificationReceived) => {
    if (!token) return;

    connection = new HubConnectionBuilder()
        .withUrl("https://localhost:7067/notificationhub", {
            accessTokenFactory: () => token
        })
        .withAutomaticReconnect()
        .build();

    connection.on("ReceiveNotification", onNotificationReceived);

    connection.start()
        .catch(err => console.error("SignalR error:", err));
};

export const stopConnection = () => {
    if (connection) {
        connection.stop()
            .then(() => console.log("Connection stop"))
            .catch(err => console.error("Connection error", err));
        connection = null;
    }
};

export const getConnection = () => connection;
