import { HubConnectionBuilder } from "@microsoft/signalr";

const apiUrl = import.meta.env.VITE_API_URL;

export const connection = new HubConnectionBuilder()
    .withUrl(`${apiUrl}/notificationHub`, {
        accessTokenFactory: () => localStorage.getItem("token"),
    })
    .withAutomaticReconnect()
    .build();
