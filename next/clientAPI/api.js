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

let baseURL = '';
if (process.env.NEXT_PUBLIC_NODE_ENV === 'development') {
    baseURL = `http://${process.env.NEXT_PUBLIC_API_SERVER_URL}:${process.env.NEXT_PUBLIC_API_SERVER_PORT}`;
}
//In production the Nginx reverse proxy will redirect traffic to the correct port.
else if (NEXT_PUBLIC_NODE_ENV === 'production') {
    baseURL = `https://${process.env.NEXT_PUBLIC_API_SERVER_URL}`;
}

class Api {
    constructor() {
        this._api = axios.create({
            baseURL: baseURL,
            withCredentials: true,
            timeout: 9000 //Timeout response after 9 seconds
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

    async checkAuthUserRole() {
        const response = await this.api.post("/api/auth/checkAuthUserRole");
        return response.data;
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

    async getUserIDsByRole(role) {
        const response = await this.api.get(`/api/users/getUsersByRole/${role}`);
        return response.data;
    }

    async changeUserRole(user_id, role) {
        const response = await this.api.put(`/api/users/changeUserRole`, {
            user_id: user_id,
            role: role
        });
        return response.data;
    }

    //Get the userID from a username
    async getUserID(username) {
        console.log("username from getUserID in api.js", username);
        const response = await this.api.get(`/api/users/getUserId/${username}`);
        console.log("response.data from getUserID in api.js", response.data);
        return response.data;
    }

    async getUserInfo(userID) {
        const response = await this.api.get(`/api/users/${userID}/UserInfo`);
        return response.data;
    }

    async getProfilePic(userid) {
        //const response = await this.api.get(`/api/users/${userid}/profilepic`, { responseType: "blob" });
        const response = await this.api.get(`/api/users/${userid}/profilepic`);
        return response.data;
    }

    async uploadProfilePic(file) {
        const multipartData = createMultipartData({context: "avatar"}, file);
        const response = await this.api.put(`/api/users/uploadProfilePic`, multipartData, {
            headers: { "content-type": "multipart/form-data" }
        });
        return response.data;
    }

    async addFollower(userID_two) {
        const response = await this.api.post(`/api/users/addFollower`, {
            userID_two: userID_two
        });
        return response.data;
    }

    async removeFollower(userID_two) {
        const response = await this.api.delete(`/api/users/removeFollower/${userID_two}`);
        return response.data;
    }

    async getFollowers(userID) {
        const response = await this.api.get(`/api/users/${userID}/getFollowers`);
        return response.data;
    }

    async getFollowing(userID) {
        const response = await this.api.get(`/api/users/${userID}/getFollowing`);
        return response.data;
    }

    async checkIsFollowing(userID_two) {
        const response = await this.api.get(`/api/users/checkIsFollowing/${userID_two}`);
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
        const response = await this.api.put(`/api/posts/editPost`);
        return response.data;
    }

    async getUserPosts(user_id, limit) {
        const response = await this.api.get(`/api/posts/getUserPosts?user_id=${user_id}&limit=${limit}`);
        return response.data;
    }

    async getSinglePost(post_id) {
        const response = await this.api.get(`/api/posts/getSinglePost/${post_id}`);
        return response.data;
    }

    async getMultiplePosts(post_ids) {
        const response = await this.api.post(`/api/posts/getMultiplePosts`, {
            post_ids: post_ids
        });
        console.log("response.data", response.data)
        return response.data;
    }

    async getLatestPosts(limit) {
        const response = await this.api.get(`/api/posts/getLatestPosts?limit=${limit}`);
        return response.data;
    }

    async getNewsFeed() {
        const response = await this.api.get(`/api/posts/getNewsFeed`);
        return response.data;
    }

    async addPostBookmark(post_id) {
        const response = await this.api.post(`/api/posts/addPostBookmark`, {
            post_id: post_id
        });
        return response.data;
    }

    async removePostBookmark(post_id) {
        const response = await this.api.delete(`/api/posts/removePostBookmark/${post_id}`);
        return response.data;
    }

    async getBookmarkedPosts() {
        const response = await this.api.get(`/api/posts/getBookmarkedPosts`);
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
        const response = await this.api.put(`/api/comments/editComment`);
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

    async paypalCreateOrder(cartData) {
        const response = await this.api.post(`/api/payments/paypalCreateOrder`, {
            cartData: cartData
        });
        return response.data.orderID;
    }

    async paypalTransactionComplete(orderID) {
        const response = await this.api.post(`/api/payments/paypalTransactionComplete`, {
            orderID: orderID
        });
        return response.data;
    }

    async createReport(post_id, report_reason) {
        const response = await this.api.post(`/api/reports/createReport`, {
            post_id: post_id,
            report_reason: report_reason
        });
        return response.data;
    }

    // If limit is 0 then all reports are fetched
    async getReports(limit = 0) {
        const response = await this.api.get(`/api/reports/getReports?limit=${limit}`);
        return response.data;
    }

    async deleteReport(post_id) {
        const response = await this.api.delete(`/api/reports/deleteReport/${post_id}`);
        return response.data;
    }

    async getNotifications() {
        const response = await this.api.get(`/api/notifications/getNotifications`);
        console.log("response.data: from getNotifications", response.data)
        return response.data;
    }

    async readNotification(notif_id) {
        const response = await this.api.put(`/api/notifications/readNotification`, {
            notif_id: notif_id
        });
        return response.data;
    }
}

const jasmaApi = new Api();
export default jasmaApi;
