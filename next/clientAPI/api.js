import axios from "axios";
import fetch from "node-fetch";

const baseURL = `http://${process.env.NEXT_PUBLIC_API_SERVER_URL}:${process.env.NEXT_PUBLIC_API_SERVER_PORT}`;

class Api {
    constructor() {
        this._api = axios.create({
            baseURL: baseURL,
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

    //Check if a user is authenticated (logged in)
    async checkAuth(req) {
        const response = await fetch(`${baseURL}/api/auth/checkAuth`, {
            method: "POST",
            headers: req.headers
        });
        const data = await response.json();
        return data;
    }

    async logout() {
        const response = await this.api.post("/api/auth/logout");
        return response.data;
    }

    async getProfilePic(userid) {
        const response = await this.api.get(`/api/users/${userid}/profilepic`, { responseType: "blob" });
        return response.data;
    }

    async createPost(text_content, hashtags, file) {
        const response = await this.api.post("/api/posts/createPost", {
            text_content: text_content,
            hashtags: hashtags,
            file: file
        });
        return response.data;
    }

    async getUserPosts(user_id, limit) {
        const response = await this.api.get(`/api/posts/getUserPosts?user_id=${user_id}&limit=${limit}`);
        return response.data;
    }

    async getLatestPosts(limit) {
        const response = await this.api.get(`/api/posts/getLatestPosts?limit=${limit}`);
        return response.data;
    }

    async createComment(post_id, comment_text, file) {
        const response = await this.api.post(`/api/comments/createComment`, {
            post_id: post_id,
            comment_text: comment_text,
            file: file
        });
        return response.data;
    }

    async getComments(post_id, limit) {
        const response = await this.api.get(`/api/comments/getComments?post_id=${post_id}&limit=${limit}`);
        return response.data;
    }
}

const jasmaApi = new Api();
export default jasmaApi;
