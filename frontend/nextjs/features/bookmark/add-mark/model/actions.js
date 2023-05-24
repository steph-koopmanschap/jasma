import { addBookmark } from "@/entities/bookmark";
/**
 *
 * @param {String} post_id
 * @returns
 */
export async function addPostBookMark(post_id) {
    try {
        const response = await addBookmark(post_id);
        return response.data;
        // handle store logic
    } catch (error) {
        console.error(error);
        return error;
    }
}
