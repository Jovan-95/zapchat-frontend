// pusherClient.ts
import Pusher from "pusher-js";

let pusher: Pusher | null = null;

const API_URL = import.meta.env.VITE_API_URL;

export const initPusher = (token: string) => {
  if (pusher) {
    pusher.disconnect(); // za svaki slučaj ako već postoji stara konekcija
  }
  console.log("Token", token);
  pusher = new Pusher("c62c108160e4b23c8f71", {
    cluster: "eu",
    forceTLS: true,
    // authEndpoint: "http://127.0.0.1:8000/broadcasting/auth",
    authEndpoint: `${API_URL}/broadcasting/auth`,

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
