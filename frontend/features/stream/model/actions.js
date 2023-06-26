const { handleError } = require("@/shared/utils");

export const handleGenerateStreamKey = async (userID) => {
    try {
        const req = new Promise((res, rej) => {
            res(`test${Math.random() * 1000}`);
        });

        return await req;
    } catch (error) {
        return handleError(error);
    }
};
