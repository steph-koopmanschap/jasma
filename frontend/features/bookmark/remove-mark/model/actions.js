import { removePostBookmark } from "@/entities/bookmark";
import { handleError } from "@/shared/utils";
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
        return handleError(error);
    }
}
