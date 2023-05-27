import { createComment, getComments, editComment, deleteComment } from "@/entities/comment";
import { createMultipartData } from "@/shared/utils";

/**
 *
 * @param {String} commentData string comment body
 * @param {*} file file from input
 * @returns
 */

const handleCreatePostComment = async (commentData, file) => {
    try {
        console.log("commentData", commentData);
        const multipartData = createMultipartData(commentData, file);
        const res = await createComment(multipartData);
        return res;
    } catch (error) {
        return { error: true, message: "Error." + error };
    }
};

/**
 *
 * @param {String} postID
 * @param {Number} limit max amount of data per response
 * @returns
 */

const useGetComments = async (postID, limit) => {
    return useQuery(
        [`comments_${postID}`],
        async () => {
            return await getComments(postID, limit);
        },
        {
            enabled: true,
            refetchOnWindowFocus: false
        }
    );
};

/**
 *
 * @param {String} commentId
 * @returns
 */

const handleDeleteComment = async (commentId) => {
    try {
        const res = await deleteComment(commentId);
        // handle store logic
        return res;
    } catch (error) {
        return { error: true, message: "Error." + error };
    }
};
/**
 *
 * @param {String} commentId
 * @returns
 */

const handleEditComment = async (commentId) => {
    try {
        const res = await editComment(commentId);
        // handle store logic
        return res;
    } catch (error) {
        return { error: true, message: "Error." + error };
    }
};

export { handleCreatePostComment, useGetComments, handleEditComment, handleDeleteComment };
