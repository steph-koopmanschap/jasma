const { register } = require("@/entities/auth");

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
        return { error: true, message: "Error." + error };
    }
};

export { handleSignup };
