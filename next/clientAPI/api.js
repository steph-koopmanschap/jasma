import axios from "axios";
import fetch from "node-fetch";

function createMultipartData(data, file) {
    const formData = new FormData();

    for (const key in data) {
        const value = data[key];
        formData.append(key, value);
    }

    if (file) {
        formData.append("file", file);
    }

    return formData;
}

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

        if (response.data.success === false) {
            return response.data;
        }
        //Strip all data except user_id and username from the response
        const returnData = {
            success: response.data.success,
            user: {
                user_id: response.data.user.user_id,
                username: response.data.user.username
            },
            message: response.data.message
        };

        return returnData;
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

    async checkAuthClientSide() {
        const response = await this.api.post("/api/auth/checkAuth");
        return response.data.isAuth;
    }

    async logout() {
        const response = await this.api.post("/api/auth/logout");
        return response.data;
    }

    async changePassword(newPassword) {
        const response = await this.api.post("/api/auth/changePassword", {
            newPassword: newPassword
        });
        return response.data;
    }

    //Get the userID from a username
    async getUserID(username) {
        const response = await this.api.get(`/api/users/getUserId/${username}`);
        return response.data;
    }

    async getUserInfo(userID) {
        const response = await this.api.get(`/api/users/${userID}/UserInfo`);
        return response.data;
    }

    async getProfilePic(userid) {
        const response = await this.api.get(`/api/users/${userid}/profilepic`, { responseType: "blob" });
        return response.data;
    }

    async getClientUser() {
        const response = await this.api.get("/api/users/getClientUser");
        return response.data;
    }

    async createPost(postData, file) {
        console.log("postData", postData);

        const multipartData = createMultipartData(postData, file);
        const response = await this.api.post("api/posts/createPost", multipartData, {
            headers: { "content-type": "multipart/form-data" }
        });
        console.log("multipart response(post)", response.data);
    }

    async deletePost(postID) {
        const response = await this.api.delete(`/api/posts/deletePost/${postID}`);
        return response.data;
    }

    //Not tested yet
    async editPost(postID) {
        const response = await this.api.put(`/api/posts/editPost/`);
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

    async createComment(commentData, file) {
        console.log("commentData", commentData);
        const multipartData = createMultipartData(commentData, file);
        const response = await this.api.post(`/api/comments/createComment`, multipartData, {
            headers: { "content-type": "multipart/form-data" }
        });
        console.log("multipart response(comment)", response.data);
        return response.data;
    }

    async deleteComment(commentID) {
        const response = await this.api.delete(`/api/comments/deleteComment/${commentID}`);
        return response.data;
    }

    //Not tested yet
    async editComment(commentID) {
        const response = await this.api.put(`/api/comments/editComment/`);
        return response.data;
    }

    async getComments(post_id, limit) {
        const response = await this.api.get(`/api/comments/getComments?post_id=${post_id}&limit=${limit}`);
        return response.data;
    }

    async search(keyword, filter) {
        const response = await this.api.get(`/api/search/search?q=${keyword}&filter=${filter}`);
        return response.data;
    }
}

const jasmaApi = new Api();
export default jasmaApi;
