import { LoginFormUser, RegisterFormUser, ResetUserObj } from "../types/type";

const API_URL = "http://127.0.0.1:8000/api";

// Post HTTP method
export async function registerNewUser(user: RegisterFormUser) {
    try {
        const res = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(user),
        });
        if (!res.ok) throw new Error(`${res.status}, ${res.statusText}`);
        const data = await res.json();
        // console.log(data);
        return data;
    } catch (err) {
        console.log(err);
    }
}

// Login
export async function loginUser(user: LoginFormUser) {
    try {
        const res = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(user),
        });
        if (!res.ok) throw new Error(`${res.status}, ${res.statusText}`);
        const data = await res.json();
        // console.log(data);
        return data;
    } catch (err) {
        console.log(err);
    }
}

// Logout
export async function logoutUser() {
    try {
        // Find token
        const storedUser = localStorage.getItem("loggedInUser");
        const token = storedUser ? JSON.parse(storedUser).auth_token : null;

        if (!token) throw new Error("No token found");

        const res = await fetch(`${API_URL}/logout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) throw new Error(`${res.status}, ${res.statusText}`);

        const data = await res.json();
        // console.log(data);

        return data;
    } catch (err) {
        console.error(err);
    }
}

// Forgot Password Post HTTP request
export async function forgotPasswordReq(email: string) {
    try {
        const res = await fetch(`${API_URL}/forgot-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({ email }),
        });
        if (!res.ok) throw new Error(`${res.status}, ${res.statusText}`);
        const data = await res.json();
        console.log(data);
        return data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

// Reset Password Post HTTP request
export async function resetPasswordReq(resetUserObj: ResetUserObj) {
    try {
        const res = await fetch(`${API_URL}/reset-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(resetUserObj),
        });
        if (!res.ok) throw new Error(`${res.status}, ${res.statusText}`);
        const data = await res.json();
        console.log(data);
        return data;
    } catch (err) {
        console.log(err);
    }
}
