import { getCategories, getLiveSearchResults, getLiveStreams } from "@/entities/stream";
import { useQuery } from "react-query";

import { handleError } from "@/shared/utils/handleError";

const DEFAULTS = {
    refetchOnWindowFocus: false,
    refetchOnmount: false,
    refetchOnReconnect: false,
    staleTime: 5 * 60 * 1000
};

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
export const handleGetLiveStreams = (category = "", page = 1) => {
    return useQuery(["liveList", category], () => getLiveStreams(category, page), {
        enabled: true,
        ...DEFAULTS
    });
};

export const handleStreamSearch = (searchTerm) => {
    return useQuery(
        ["liveSearchResults"],
        async () => {
            return getLiveSearchResults(searchTerm);
        },
        {
            enabled: true,
            ...DEFAULTS
        }
    );
};

/**
 * Get stream categories
 * @returns
 */

export const handleGetCategories = () => {
    return useQuery("live_categories", getCategories, { enabled: true, onError: handleError, ...DEFAULTS });
};
