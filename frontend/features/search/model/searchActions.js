import { search } from "@/entities/search";
import { handleError } from "@/shared/utils";
import { useQuery } from "react-query";

/**
 *
 * @param {String} q query to search for
 * @param {String} filter any of the following filters: "hashtags", "posts", "comments", "users", "bookmarks"
 * @returns
 */

const useGetSearchResults = (q, filter) =>
    useQuery(
        [`search_key=${q}&filter=${filter}`],
        async () => {
            return await search(q, filter);
        },
        {
            enabled: true,
            refetchOnWindowFocus: false,
            onError: handleError
        }
    );
export { useGetSearchResults };
