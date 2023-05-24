import { api } from "@/shared/api/axios";

const POST_API = api;

const createPost = async (postData, file) => {
    console.log("postData", postData);

    const multipartData = createMultipartData(postData, file);
    const response = await POST_API.post("api/posts/createPost", multipartData, {
        headers: { "content-type": "multipart/form-data" }
    });
    console.log("multipart response(post)", response.data);
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

//Not tested yet

/**
 *
 * @param {String} postID
 * @returns
 */
const editPost = async (postID) => {
    const response = await POST_API.put(`/api/posts/editPost`);
    return response.data;
};

export { deletePost, editPost, createPost };
