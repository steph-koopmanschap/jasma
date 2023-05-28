import { changePassword } from "@/entities/auth";
/**
 *
 * @param {String} newPass
 * @returns
 */

const handlePassChange = async (newPass) => {
    try {
        const res = await changePassword(newPass);
        return res;
    } catch (error) {
        return { error: true, message: "Error." + error };
    }
};

export { handlePassChange };
