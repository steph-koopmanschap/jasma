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
 * @param {Number} page query with page number. Defaults to 1
 * @returns
 */
export const handleGetLiveStreams = async (category = "", page = 1) => {
    return useQuery(
        ["liveList"],
        async () => {
            return getLiveStreams(category, page);
        },
        {
            enabled: true,
            refetchOnWindowFocus: false,
            onError: handleError
        }
    );
};

export const handleStreamSearch = async () => {};
