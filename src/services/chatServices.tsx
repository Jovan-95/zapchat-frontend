import { SendMessagePayload } from "../types/interfaces";

const API_URL = "http://127.0.0.1:8000/api";

export async function fetchUsers(search?: string) {
    const storedUser = localStorage.getItem("loggedInUser");
    const token = storedUser ? JSON.parse(storedUser).auth_token : null;
    if (!token) throw new Error("No token found");
    const query = search ? `?search=${encodeURIComponent(search)}` : "";

    const res = await fetch(`${API_URL}/users${query}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch users");
    }

    return res.json();
}

// Send message
export async function sendMessage(payload: SendMessagePayload) {
    const storedUser = localStorage.getItem("loggedInUser");
    const token = storedUser ? JSON.parse(storedUser).auth_token : null;
    if (!token) throw new Error("No token found");

    const res = await fetch(`${API_URL}/send-message`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        throw new Error("Failed to send message");
    }

    return res.json();
}

export async function fetchMessages(contact_id?: number) {
    const storedUser = localStorage.getItem("loggedInUser");
    const token = storedUser ? JSON.parse(storedUser).auth_token : null;
    if (!token) throw new Error("No token found");

    const url = contact_id
        ? `${API_URL}/fetch-messages?contact_id=${contact_id}`
        : `${API_URL}/fetch-messages`;

    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch messages");
    }

    return res.json();
}

// Typing POST
export async function activateTyping(id: number) {
    const storedUser = localStorage.getItem("loggedInUser");
    const token = storedUser ? JSON.parse(storedUser).auth_token : null;
    if (!token) throw new Error("No token found");

    const res = await fetch(`${API_URL}/user/typing`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ to_id: id }),
    });
    console.log(res);

    if (!res.ok) {
        throw new Error("Failed to send message");
    }

    return res.json();
}
