import { api } from "@/shared/api/axios";

const COMMENT_API = api;
const COMMENT_ENDPOINT = "/api/comments";
/**
 *
 * @param {FormData} multipartData formed data object
 * @returns
 */

const createComment = async (multipartData) => {
    const response = await COMMENT_API.post(`${COMMENT_ENDPOINT}/createComment`, multipartData, {
        headers: { "content-type": "multipart/form-data" }
    });
    console.log("multipart response(comment)", response.data);
    return response.data;
};

/**
 *
 * @param {String} post_id
 * @param {Number} limit max amount of data per response
 * @returns
 */

const getComments = async (post_id, limit) => {
    const response = await COMMENT_API.get(`${COMMENT_ENDPOINT}/getComments?post_id=${post_id}&limit=${limit}`);
    return response.data;
};

/**
 *
 * @param {String} commentID
 * @returns
 */

const deleteComment = async (commentID) => {
    const response = await COMMENT_API.delete(`${COMMENT_ENDPOINT}/deleteComment/${commentID}`);
    return response.data;
};

//Not tested yet
/**
 *
 * @param {String} commentID
 * @returns
 */
const editComment = async (commentID) => {
    const response = await COMMENT_API.put(`${COMMENT_ENDPOINT}/editComment`);
    return response.data;
};

export { getComments, createComment, editComment, deleteComment };
