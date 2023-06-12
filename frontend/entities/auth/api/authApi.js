import { api } from "@/shared/api/axios";

const AUTH_API = api;
const AUTH_ENDPOINT = "/api/auth";

const logout = async () => {
    const response = await AUTH_API.post(`${AUTH_ENDPOINT}/logout`);
    return response.data;
};

/**
 *
 * @param {String} email
 * @param {String} password
 * @returns
 */
const login = async (email, password) => {
    const response = await AUTH_API.post(`${AUTH_ENDPOINT}/login`, { email: email, password: password });

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
};

/**
 *
 * @param {String} username
 * @param {String} email
 * @param {String} password
 * @returns
 */
const register = async (username, email, password) => {
    const response = await AUTH_API.post(`${AUTH_ENDPOINT}/register`, {
        username: username,
        email: email,
        password: password
    });
    return response.data;
};

const checkAuth = async () => {
    const response = await AUTH_API.post(`${AUTH_ENDPOINT}/checkAuth`);
    return response.data.isAuth;
};

const checkAuthUserRole = async () => {
    const response = await AUTH_API.post(`${AUTH_ENDPOINT}/checkAuthUserRole`);
    return response.data;
};

/**
 *
 * @param {String} newPassword
 * @returns
 */
const changePassword = async (newPassword) => {
    const response = await AUTH_API.post(`${AUTH_ENDPOINT}/changePassword`, {
        newPassword: newPassword
    });
    return response.data;
};

export { changePassword, checkAuth, checkAuthUserRole, login, logout, register };
