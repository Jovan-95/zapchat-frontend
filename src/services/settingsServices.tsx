import { EditedUser } from "../types/type";

// const API_URL = "http://127.0.0.1:8000/api";
// const API_URL = "https://zap-chat-backend-production-03b2.up.railway.app/api";
const API_URL = import.meta.env.VITE_API_URL;

//// Patch HTTP method Edit user
export async function editUser(editedObj: EditedUser) {
  try {
    // Find token
    const storedUser = localStorage.getItem("loggedInUser");
    const token = storedUser ? JSON.parse(storedUser).auth_token : null;

    if (!token) throw new Error("No token found");

    const res = await fetch(`${API_URL}/api/user/settings`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editedObj),
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

// Upload / Change Avatar HTTP request
export async function uploadAvatar(file: File) {
  const storedUser = localStorage.getItem("loggedInUser");
  const token = storedUser ? JSON.parse(storedUser).auth_token : null;

  if (!token) throw new Error("No token found");

  const formData = new FormData();
  formData.append("avatar", file);

  const res = await fetch(`${API_URL}/api/user/avatar`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to upload avatar");
  }

  return res.json();
}
