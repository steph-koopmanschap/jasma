import { AxiosError } from "axios";

const IS_DEVMODE = process.env.NEXT_PUBLIC_NODE_ENV === "development";

/**
 *
 * @param {AxiosError | Error} error
 * @returns {Object} {error: Boolean, message: String}
 */

export const handleError = (error) => {
    const errRes = Object.create(null);
    errRes.error = true;

    if (IS_DEVMODE) console.error(error);

    if (error instanceof Error) {
        errRes.message = "Something went wrong!";
        return errRes;
    }

    if (error.response) {
        errRes.message = error.response.data;
        return errRes;
    }
    errRes.message = "Unknown Error!";
    return errRes;
};
