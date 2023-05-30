import { api } from "@/shared/api/axios";

const POST_API = api;
const POST_ENDPOINT = "/api/posts";

/**
 *
 * @param {FormData} multipartData formed multipart object
 * @returns
 */

const createPost = async (multipartData) => {
    const response = await POST_API.post(`${POST_ENDPOINT}/createPost`, multipartData, {
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
    const response = await POST_API.delete(`${POST_ENDPOINT}/deletePost/${postID}`);
    return response.data;
};

/**
 * //Not tested yet
 * @param {String} postID
 * @returns
 */
const editPost = async (postID) => {
    const response = await POST_API.put(`${POST_ENDPOINT}/editPost`);
    return response.data;
};

/**
 *
 * @param {String} user_id
 * @param {Number} limit max amount of data per query
 * @returns
 */

const getUserPosts = async (user_id, limit) => {
    const response = await POST_API.get(`${POST_ENDPOINT}/getUserPosts?user_id=${user_id}&limit=${limit}`);
    return response.data;
};

/**
 *
 * @param {String} post_id
 * @returns
 */

const getSinglePost = async (post_id) => {
    const response = await POST_API.get(`${POST_ENDPOINT}/getSinglePost/${post_id}`);
    return response.data;
};

const getNewsFeed = async () => {
    const response = await POST_API.get(`${POST_ENDPOINT}/getNewsFeed`);
    return response.data;
};

/**
 *
 * @param {Number} limit max posts per query
 * @returns
 */

const getLatestPosts = async (limit) => {
    const response = await POST_API.get(`${POST_ENDPOINT}/getLatestPosts?limit=${limit}`);
    return response.data;
};

/**
 *
 * @param {Array} post_ids
 * @returns
 */

const getMultiplePosts = async (post_ids) => {
    const response = await POST_API.post(`${POST_ENDPOINT}/getMultiplePosts`, {
        post_ids: post_ids
    });
    console.log("response.data", response.data);
    return response.data;
};

export { getNewsFeed, deletePost, editPost, createPost, getLatestPosts, getSinglePost, getUserPosts, getMultiplePosts };
