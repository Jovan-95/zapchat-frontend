// pusherClient.ts
import Pusher from "pusher-js";

let pusher: Pusher | null = null;

export const initPusher = (token: string) => {
    if (pusher) {
        pusher.disconnect(); // za svaki slučaj ako već postoji stara konekcija
    }

    pusher = new Pusher("c62c108160e4b23c8f71", {
        cluster: "eu",
        forceTLS: true,
        authEndpoint: "http://127.0.0.1:8000/broadcasting/auth",
        auth: {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        },
    });

    return pusher;
};

export const getPusher = () => pusher;
