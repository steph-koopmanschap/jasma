import axios from "axios";

// Client API functions that communicate with the API server

// Axios config
const api = axios.create({
    baseURL: `http://${process.env.NEXT_PUBLIC_API_SERVER_URL}:${process.env.NEXT_PUBLIC_API_SERVER_PORT}`,
    withCredentials: true,
    timeout: 2000, //Timeout response after 2 seconds
});

/* Auth Functions */

export async function login(email, password) {
    const response = await api.post("/api/auth/login", {email: email, password: password});
    return response.data;
}

export async function register(username, email, password) {
    const response = await api.post("/api/auth/register", {username: username, email: email, password: password});
    return response.data;
}

export async function logout() {
    const response = await api.post("/api/auth/logout");
    return response.data;
}

/* User functions */

export async function getProfilePic(userid) {
    const response = await api.get(`/api/users/${userid}/profilepic`, {responseType: 'blob'});
    return response.data;
}
