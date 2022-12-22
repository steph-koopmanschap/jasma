import axios from "axios";
import fetch from "node-fetch";

class Api {
    constructor() {
        this._api = axios.create({
            baseURL: `http://${process.env.NEXT_PUBLIC_API_SERVER_URL}:${process.env.NEXT_PUBLIC_API_SERVER_PORT}`,
            withCredentials: true,
            timeout: 2000 //Timeout response after 2 seconds
        });
    }

    get api() {
        return this._api;
    }

    async login(email, password) {
        const response = await this.api.post("/api/auth/login", { email: email, password: password });
        return response.data;
    }

    async register(username, email, password) {
        const response = await this.api.post("/api/auth/register", {
            username: username,
            email: email,
            password: password
        });
        return response.data;
    }

    async logout() {
        const response = await this.api.post("/api/auth/logout");
        return response.data;
    }

    async getProfilePic(userid) {
        const response = await this.api.get(`/api/users/${userid}/profilepic`, { responseType: "blob" });
        return response.data;
    }

    async checkAuth(req) {
        const response = await fetch("http://localhost:5000/api/auth/checkAuth", {
            method: "POST",
            headers: req.headers
        });
        const data = await response.json();
        return data;
    }
}

const jasmaApi = new Api();
export default jasmaApi;
