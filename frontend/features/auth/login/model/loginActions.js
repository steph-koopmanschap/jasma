import { login } from "@/entities/auth";
import { handleError } from "@/shared/utils";

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
        return handleError(error);
    }
};

export { handleLogin };
