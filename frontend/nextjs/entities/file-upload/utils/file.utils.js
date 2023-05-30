import { GB } from "@/shared/constants";

function fileInputError(text) {
    toast.error(text, {
        position: "bottom-center",
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light"
    });
}

/**
 * FileSize and limit are both in bytes
 * Returns true if file is too large
 * Returns false if file is limit
 * @param {Number} fileSize size of a file in bytes
 * @param {Number} limit max size of a file in bytes
 * @returns {Boolean}
 */

function checkFileTooLarge(fileSize, limit = 1.5 * GB) {
    if (fileSize >= limit) {
        return true;
    }
    return false;
}

export { checkFileTooLarge, fileInputError };
