const { api } = require("@/shared/api/axios");

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
export { getProfilePic, getClientUser };
