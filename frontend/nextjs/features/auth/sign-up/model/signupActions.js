import { handleError } from "@/shared/utils";
import { register } from "@/entities/auth";

/**
 *
 * @param {String} username
 * @param {String} email
 * @param {String} password
 */
const handleSignup = async (username, email, password) => {
    try {
        const res = await register(username, email, password);
        return res;
    } catch (error) {
        return handleError(error);
    }
};

export { handleSignup };
