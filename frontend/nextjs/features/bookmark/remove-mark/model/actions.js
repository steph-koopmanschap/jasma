import { removePostBookmark } from "@/entities/bookmark";
/**
 *
 * @param {String} post_id
 * @returns
 */
export async function removeBookmark(post_id) {
    try {
        const response = await removePostBookmark(post_id);
        return response.data;
        // handle store logic
    } catch (error) {
        console.error(error);
        return error;
    }
}
