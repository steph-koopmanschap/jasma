import axios from "axios";
import fetch from "node-fetch";
import Cookies from 'js-cookie';

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
else if (process.env.NEXT_PUBLIC_NODE_ENV === 'production') {
    baseURL = `https://${process.env.NEXT_PUBLIC_API_SERVER_URL}`;
}

//Check if a cookie exists by name
function checkCookieExists(name) {
    //First get all the cookies in the current document
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) 
    {
        //Trim trailing whitespace
        const cookie = cookies[i].trim();
        //check if cookie equals the name.
        if (cookie.startsWith(`${name}=`)) 
        {
            return true;
        }
    }
    return false;
}

//Get the CSRF token from the cookie.
async function get_CSRF_TOKEN_fromCookie() {
    console.log("This function is disabled for now...FROM: async function get_CSRF_TOKEN_fromCookie() in api.js");
//     let token = "";
//    // The CSRF token already exists in the cookie
//     if (checkCookieExists('XSRF-TOKEN') === true) {
//         token = Cookies.get('XSRF-TOKEN');
//     }
//     // if (checkCookieExists('_csrf') === true)
//     // {
//     //     token = Cookies.get('_csrf');
//     // }
//     //The CSRF Token does not exist yet. Request server for a CSRF Token.
//     else {
//         token = await requestCSRF_TOKEN();
//     }
//     console.log("token:", token);
//     return token;
}

const axiosInstance = axios.create({
    baseURL: baseURL,
    withCredentials: true,
    timeout: 9000 //Timeout response after 9 seconds
});

//Request a CSRF Token from the server.
async function requestCSRF_TOKEN() {
    const response = await axiosInstance.get("/requestCSRF-TOKEN");
    console.log("requestCSRF_TOKEN: ", response.data);
    return response.data;
}

class Api {
    constructor() {
        this._api = axiosInstance;

        //this.csrf_token = requestCSRF_TOKEN();

        //Attach CSRF token to requests, except GET request.
        //The request intercepter performs some code before every request.
        
        // this._api.interceptors.request.use((config) => {
        //     // Only send CSRF token on POST, PUT, and DELETE requests
        //     if (['post', 'put', 'delete'].includes(config.method.toLowerCase())) 
        //     {
        //         //config.headers['X-CSRF-Token'] = get_CSRF_TOKEN_fromCookie();
        //         config.headers['_csrf'] = get_CSRF_TOKEN_fromCookie();
        //     }
        //     return config;
        // },
        //     // Do something with request error.
        //     (error) => Promise.reject(error)
        // );
    }

    get api() {
        return this._api;
    }

    async getCSRF_TOKEN() {
        return await get_CSRF_TOKEN_fromCookie();
    }

    // //Request a CSRF Token from the server.
    // async requestCSRF_TOKEN() {
    //     const response = await this.api.get("/requestCSRF-TOKEN");
    //     console.log(response.data);
    //     return response.data;
    // }

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

    async stripeCreateCheckoutSession(cartData) {
        const response = await this.api.post(`/api/payments/stripeCreateCheckoutSession`, {
            cartData: cartData
        });
        return response.data.orderID;
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

    async readNotification(notification_id, timestamp) {
        const response = await this.api.put(`/api/notifications/readNotification`, {
            notification_id: notification_id,
            timestamp: timestamp
        });
        return response.data;
    }
    
    async getSubscribedHashtags() {
        const response = await this.api.get(`/api/hashtags/getSubscribedHashtags`);
        return response.data;        
    }

    async subscribeToHashtags(hashtags) {
        const response = await this.api.post(`/api/hashtags/subscribeToHashtags`, {
            hashtags: hashtags
        });
        return response.data;        
    }

    async unsubscribeFromHashtag(hashtag) {
        const response = await this.api.delete(`/api/hashtags/unsubscribeFromHashtag/${hashtag}`);
        return response.data;        
    }

    async createAd(advertData) {
        const response = await this.api.post(`/api/ads/createAd`, {
            advertData: advertData
        });
        return response.data;        
    }

    async deleteAd(adID) {
        const response = await this.api.delete(`/api/ads/deleteAd/${adID}`);
        return response.data;        
    }

    async editAd(advertData) {
        const response = await this.api.put(`/api/ads/editAd`, {
            advertData: advertData
        });
        return response.data;        
    }

    async getAd(adID) {
        const response = await this.api.get(`/api/ads/getAd/${adID}`);
        return response.data;        
    }

    async getAds() {
        const response = await this.api.get(`/api/ads/getAds`);
        return response.data;        
    }
}

const jasmaApi = new Api();
export default jasmaApi;



/*

You can check the status code of the HTTP response to determine whether it's an error response or not. 
If the status code is between 200 and 299, it's a successful response, and you can return the data from the response. 
Otherwise, if the status code is outside that range, you can return the error message from the response.

Here's how you could modify the code to handle error responses:

async addFollower(userID_two) {
  try {
    const response = await this.api.post(`/api/users/addFollower`, {
      userID_two: userID_two
    });

    if (response.status >= 200 && response.status <= 299) {
      return response.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    return{ error: error.response.data.message }
  }
}

*/
