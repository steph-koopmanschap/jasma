import {
    createPost,
    createReport,
    deletePost,
    editPost,
    getLatestPosts,
    getNewsFeed,
    getSinglePost,
    getUserPosts
} from "@/entities/post/index.js";
import { createMultipartData } from "@/shared/utils";
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
        return { message: error.message || "Something went wrong!", error: true };
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
        return { message: error.message || "Something went wrong!", error: true };
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
        return { message: error.message || "Something went wrong!", error: true };
    }
};
/**
 *
 * @param {String} postID
 * @returns {Promise}
 */

const handleSharePost = (postID) => {
    return navigator.clipboard.writeText(`${window.location.origin}/post/${postData.post_id}`);
};

/**
 *
 * @param {String} postID
 * @param {String} report_reason  string describing report reason
 * @returns
 */

const handleReportPost = async (postID, report_reason) => {
    try {
        const res = await createReport(postID, report_reason);
        // handle store logic
        return res;
    } catch (error) {
        return { error: true, message: "Error." + error };
    }
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
            refetchOnWindowFocus: false
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
            refetchOnWindowFocus: false
        }
    );
};

const useGetLatestFeed = () =>
    useQuery(
        ["newsFeed"],
        async () => {
            return await getLatestPosts(25);
        },
        {
            enabled: true,
            refetchOnWindowFocus: false
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
            refetchOnWindowFocus: false
        }
    );

export {
    handleCreatePost,
    handleDeletePost,
    useGetNewsFeed,
    handleEditPost,
    handleSharePost,
    handleReportPost,
    useGetSinglePost,
    useGetLatestFeed,
    useGetUserPost
};
