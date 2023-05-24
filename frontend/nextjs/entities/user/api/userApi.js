const { api } = require("@/shared/api/axios");

const USER_API = api;

/**
 *
 * @param {String} userid
 * @returns
 */

const getProfilePic = async (userid) => {
    //const response = await this.api.get(`/api/users/${userid}/profilepic`, { responseType: "blob" });
    const response = await USER_API.get(`/api/users/${userid}/profilepic`);
    return response.data;
};

export { getProfilePic };
