import { getLiveStreams } from "@/entities/stream";
import { useQuery } from "react-query";

import { handleError } from "@/shared/utils/handleError";

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

/**
 *
 * @param {String} category query specified category. Defaluts to any
 * @returns
 */
export const handleGetLiveStreams = async (category = "") => {
    return useQuery(
        ["liveList"],
        async () => {
            return getLiveStreams(category);
        },
        {
            enabled: true,
            refetchOnWindowFocus: false,
            onError: handleError
        }
    );
};
