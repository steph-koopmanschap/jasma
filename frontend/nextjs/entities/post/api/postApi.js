import { api } from "@/shared/api/axios";

const POST_API = api;

/**
 *
 * @param {FormData} multipartData formed multipart object
 * @returns
 */

const createPost = async (multipartData) => {
    const response = await POST_API.post("api/posts/createPost", multipartData, {
        headers: { "content-type": "multipart/form-data" }
    });
    console.log("multipart response(post)", response.data);
    return response;
};

/**
 *
 * @param {String} postID
 * @returns
 */

const deletePost = async (postID) => {
    const response = await POST_API.delete(`/api/posts/deletePost/${postID}`);
    return response.data;
};

/**
 * //Not tested yet
 * @param {String} postID
 * @returns
 */
const editPost = async (postID) => {
    const response = await POST_API.put(`/api/posts/editPost`);
    return response.data;
};
/**
 *
 * @param {String} post_id
 * @param {String} report_reason string describing report reason
 * @returns
 */
const createReport = async (post_id, report_reason) => {
    const response = await POST_API.post(`/api/reports/createReport`, {
        post_id: post_id,
        report_reason: report_reason
    });
    return response.data;
};

/**
 *
 * @param {String} user_id
 * @param {Number} limit max amount of data per query
 * @returns
 */

const getUserPosts = async (user_id, limit) => {
    const response = await POST_API.get(`/api/posts/getUserPosts?user_id=${user_id}&limit=${limit}`);
    return response.data;
};

/**
 *
 * @param {String} post_id
 * @returns
 */

const getSinglePost = async (post_id) => {
    const response = await POST_API.get(`/api/posts/getSinglePost/${post_id}`);
    return response.data;
};

export { deletePost, editPost, createPost, createReport, getSinglePost, getUserPosts };
