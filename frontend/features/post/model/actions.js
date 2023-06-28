import {
    createPost,
    createReport,
    deletePost,
    editPost,
    getLatestPosts,
    getMultiplePosts,
    getNewsFeed,
    getSinglePost,
    getUserPosts
} from "@/entities/post/index.js";
import { copyToClipboard, createMultipartData, handleError } from "@/shared/utils";
import { useQuery } from "react-query";

/**
 *
 * @param {String} postID
 * @returns
 */

const handleDeletePost = async (postID) => {
    try {
        const res = await deletePost(postID);
        // handle store logic
        return res;
    } catch (error) {
        return handleError(error);
    }
};

/**
 *
 * @param {String} postID
 * @returns
 */

const handleEditPost = async (postID) => {
    try {
        const res = await editPost(postID);
        // handle store logic
        return res;
    } catch (error) {
        return handleError(error);
    }
};
/**
 *
 * @param {String} postData string data of a post
 * @param {*} file any media file
 * @returns
 */

const handleCreatePost = async (postData, file) => {
    try {
        const multipartData = createMultipartData(postData, file);
        const res = await createPost(multipartData);
        // handle store logic
        return res;
    } catch (error) {
        return handleError(error);
    }
};
/**
 *
 * @param {String} postID
 * @returns {Promise}
 */

const handleSharePost = (postID) => {
    return copyToClipboard(`${window.location.origin}/post/${postID}`);
};

/**
 *
 * @param {String} postID
 * @returns
 */

const useGetSinglePost = (postID) => {
    return useQuery(
        [`post_${postID}`],
        async () => {
            return await getSinglePost(postID);
        },
        {
            enabled: true,
            refetchOnWindowFocus: false,
            onError: handleError
        }
    );
};

const useGetNewsFeed = () => {
    return useQuery(
        ["newsFeed"],
        async () => {
            return await getNewsFeed();
        },
        {
            enabled: true,
            refetchOnWindowFocus: false,
            onError: handleError
        }
    );
};

/**
 *
 * @param {Number} limit max posts per query. Default is 25;
 * @returns
 */

const useGetLatestFeed = (limit = 25) =>
    useQuery(
        ["newsFeed"],
        async () => {
            return await getLatestPosts(limit);
        },
        {
            enabled: true,
            refetchOnWindowFocus: false,
            onError: handleError
        }
    );

/**
 *
 * @param {String} user_id
 * @param {Number} limit max amount of data per query
 * @returns
 */

const useGetUserPost = async (user_id, limit) =>
    useQuery(
        [`userPosts_${user_id}`],
        async () => {
            return await getUserPosts(user_id, limit);
        },
        {
            enabled: true,
            refetchOnWindowFocus: false,
            onError: handleError
        }
    );

/**
 *
 * @param {Array} post_ids
 * @param {Function} onSuccess
 * @param {Boolean} enabled when query should be enabled
 * @returns
 */

const useGetMultiplePosts = (post_ids, onSuccess, enabled = false) =>
    useQuery(
        [`postsData`],
        async () => {
            return await getMultiplePosts(post_ids);
        },
        {
            enabled: enabled,
            refetchOnWindowFocus: false,
            retry: false,
            onSuccess,
            onError: handleError
        }
    );

export {
    handleCreatePost,
    handleDeletePost,
    useGetNewsFeed,
    handleEditPost,
    handleSharePost,
    useGetSinglePost,
    useGetLatestFeed,
    useGetUserPost,
    useGetMultiplePosts
};
