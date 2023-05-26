import { login } from "@/entities/auth";

/**
 *
 * @param {String} email
 * @param {String} password
 */

const handleLogin = async (email, password) => {
    try {
        const response = await login(email, password);
        window.localStorage.setItem("loggedInUserID", response.user.user_id);
        window.localStorage.setItem("loggedInUsername", response.user.username);
        return response;
    } catch (error) {
        return { error: true, message: error.message };
    }
};

export { handleLogin };
