import { api } from "@/shared/api/axios";

const USER_API = api;
const USER_ENDPOINT = "/api/users";

/**
 *
 * @param {String} userid
 * @returns
 */

const getProfilePic = async (userid) => {
    //const response = await this.api.get(`/api/users/${userid}/profilepic`, { responseType: "blob" });
    const response = await USER_API.get(`${USER_ENDPOINT}/${userid}/profilepic`);
    return response.data;
};

const getClientUser = async () => {
    const response = await USER_API.get(`${USER_ENDPOINT}/getClientUser`);
    return response.data;
};

/**
 *
 * @param {FormData} multipartData formed data object
 * @returns
 */

const uploadProfilePic = async (multipartData) => {
    const response = await USER_API.put(`${USER_ENDPOINT}/uploadProfilePic`, multipartData, {
        headers: { "content-type": "multipart/form-data" }
    });
    return response.data;
};

/**
 *
 * @param {String} userID_two id of user to follow
 * @returns
 */

const addFollower = async (userID_two) => {
    const response = await USER_API.post(`${USER_ENDPOINT}/addFollower`, {
        userID_two: userID_two
    });
    return response.data;
};

/**
 *
 * @param {String} userID_two id of user to remove follow
 * @returns
 */

const removeFollower = async (userID_two) => {
    const response = await USER_API.delete(`${USER_ENDPOINT}/removeFollower/${userID_two}`);
    return response.data;
};

/**
 *
 * @param {String} userID
 * @returns
 */

const getFollowers = async (userID) => {
    const response = await USER_API.get(`${USER_ENDPOINT}/${userID}/getFollowers`);
    return response.data;
};

/**
 *
 * @param {String} userID
 * @returns
 */

const getFollowing = async (userID) => {
    const response = await USER_API.get(`${USER_ENDPOINT}/${userID}/getFollowing`);
    return response.data;
};

/**
 *
 * @param {String} userID_two id of user to check
 * @returns
 */

const checkIsFollowing = async (userID_two) => {
    const response = await USER_API.get(`${USER_ENDPOINT}/checkIsFollowing/${userID_two}`);
    return response.data;
};

/**
 *
 * @param {String} role
 * @returns
 */

const getUserIDsByRole = async (role) => {
    const response = await USER_API.get(`${USER_ENDPOINT}/getUsersByRole/${role}`);
    return response.data;
};

/**
 *
 * @param {String} user_id
 * @param {String} role
 * @returns
 */

const changeUserRole = async (user_id, role) => {
    const response = await USER_API.put(`${USER_ENDPOINT}/changeUserRole`, {
        user_id: user_id,
        role: role
    });
    return response.data;
};

/**
 *
 * Get the userID from a username
 * @param {String} username
 * @returns
 */
const getUserID = async (username) => {
    console.log("username from getUserID in api.js", username);
    const response = await USER_API.get(`${USER_ENDPOINT}/getUserId/${username}`);
    console.log("response.data from getUserID in api.js", response.data);
    return response.data;
};

/**
 *
 * @param {String} userID
 * @returns
 */

const getUserInfo = async (userID) => {
    const response = await USER_API.get(`${USER_ENDPOINT}/${userID}/UserInfo`);
    return response.data;
};

export {
    getProfilePic,
    getClientUser,
    checkIsFollowing,
    getFollowers,
    getFollowing,
    addFollower,
    removeFollower,
    uploadProfilePic,
    changeUserRole,
    getUserInfo,
    getUserIDsByRole,
    getUserID
};
