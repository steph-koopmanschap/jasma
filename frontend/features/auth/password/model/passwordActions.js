import { changePassword } from "@/entities/auth";
import { handleError } from "@/shared/utils";
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
        return handleError(error);
    }
};

export { handlePassChange };
