import { useQuery } from "react-query";
import { api } from "@/shared/api/axios";

const BOOKMARK_API = api;

const getBookmarkedPosts = async () => {
    const response = await api.get(`/api/posts/getBookmarkedPosts`);
    return response.data;
};

/**
 *
 * @param {String} post_id
 * @returns
 */
const addBookmark = async (post_id) => {
    const response = await BOOKMARK_API.post(`/api/posts/addPostBookmark`, {
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
    const response = await BOOKMARK_API.delete(`/api/posts/removePostBookmark/${post_id}`);
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
