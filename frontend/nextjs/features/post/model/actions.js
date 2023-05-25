import { createPost, createReport, deletePost, editPost, getSinglePost } from "@/entities/post/index.js";
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
 * @param {String} report_reason // string describing report reason
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

export { handleCreatePost, handleDeletePost, handleEditPost, handleSharePost, handleReportPost, useGetSinglePost };
