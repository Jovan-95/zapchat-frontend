import { SendMessagePayload } from "../types/interfaces";

// const API_URL = "http://127.0.0.1:8000/api";
// const API_URL = "https://zap-chat-backend-production-03b2.up.railway.app/api";
const API_URL = import.meta.env.VITE_API_URL;

export async function fetchUsers(search?: string) {
  const storedUser = localStorage.getItem("loggedInUser");
  const token = storedUser ? JSON.parse(storedUser).auth_token : null;
  if (!token) throw new Error("No token found");
  const query = search ? `?search=${encodeURIComponent(search)}` : "";

  const res = await fetch(`${API_URL}/api/users${query}`, {
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

  const res = await fetch(`${API_URL}/api/send-message`, {
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
    ? `${API_URL}/api/fetch-messages?contact_id=${contact_id}`
    : `${API_URL}/api/fetch-messages`;

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

  const res = await fetch(`${API_URL}/api/user/typing`, {
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

// New features
/////////////////////////////////////////////////////////////////
// Change user info
export async function editOtherUser(username: string, userId: number) {
  try {
    const storedUser = localStorage.getItem("loggedInUser");
    const token = storedUser ? JSON.parse(storedUser).auth_token : null;

    if (!token) throw new Error("No token found");

    const res = await fetch(`${API_URL}/api/user/${userId}/edit`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ username }),
    });

    if (!res.ok) {
      throw new Error(`${res.status}, ${res.statusText}`);
    }

    const data = await res.json();
    console.log("PATCH response EDIT user:", data);
    return data;
  } catch (err) {
    console.error("PATCH error:", err);
    throw err;
  }
}

// Delete HTTP method
export async function deleteUser(userId: number) {
  try {
    const storedUser = localStorage.getItem("loggedInUser");
    const token = storedUser ? JSON.parse(storedUser).auth_token : null;
    // console.log("token", token);
    if (!token) throw new Error("No token found");

    const res = await fetch(`${API_URL}/api/user/delete/${userId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error(`${res.status}, ${res.statusText}`);
    }
    if (res.status === 204) return { message: "Deleted successfully" };
    const data = await res.json();
    console.log(data);

    return data;
  } catch (err) {
    throw new Error("Failed to delete user: " + err);
  }
}
