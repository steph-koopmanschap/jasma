import { useQuery } from "react-query";
import { api } from "@/shared/api/axios";

const BOOKMARK_API = api;
const BOOKMARK_ENDPOINT = "/api/posts";

const getBookmarkedPosts = async () => {
    const response = await api.get(`${BOOKMARK_ENDPOINT}/getBookmarkedPosts`);
    return response.data;
};

/**
 *
 * @param {String} post_id
 * @returns
 */
const addBookmark = async (post_id) => {
    const response = await BOOKMARK_API.post(`${BOOKMARK_ENDPOINT}/addPostBookmark`, {
        post_id: post_id
    });
    return response.data;
};

/**
 *
 * @param {String} post_id
 * @returns
 */

const removePostBookmark = async (post_id) => {
    const response = await BOOKMARK_API.delete(`${BOOKMARK_ENDPOINT}/removePostBookmark/${post_id}`);
    return response.data;
};

const useGetBookmarkedPosts = () => {
    const query = useQuery(
        [`bookmarkedPosts`],
        async () => {
            return await BOOKMARK_API.getBookmarkedPosts();
        },
        {
            enabled: true,
            refetchOnWindowFocus: false
        }
    );
    return query;
};

export { useGetBookmarkedPosts, addBookmark, removePostBookmark, getBookmarkedPosts };
