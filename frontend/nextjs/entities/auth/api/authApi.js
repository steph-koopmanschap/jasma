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

//Check if a user is authenticated (logged in)
const checkAuth = async (req) => {
    const response = await fetch(`${baseURL}${AUTH_ENDPOINT}/checkAuth`, {
        method: "POST",
        headers: req.headers
    });
    const data = await response.json();
    return data;
};

const checkAuthClientSide = async () => {
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

const getCSRF_TOKEN = async () => {
    return await get_CSRF_TOKEN_fromCookie();
};

export { changePassword, checkAuth, checkAuthClientSide, checkAuthUserRole, login, logout, register, getCSRF_TOKEN };
