import { deletePost, createPost, editPost, reportPost } from "@/entities/post";

/**
 *
 * @param {String} postID
 * @returns
 */

const handleDeletePost = async (postID) => {
    try {
        const res = await deletePost(postID);
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

const handleCreatePost = async (postID) => {
    try {
        const res = await createPost();
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

export { handleCreatePost, handleDeletePost, handleEditPost, handleSharePost };
