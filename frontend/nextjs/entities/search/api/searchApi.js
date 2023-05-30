import { api } from "@/shared/api/axios";
const SEARCH_API = api;
const SEARCH_ENDPOINT = "/api/search";

/**
 *
 * @param {String} keyword query to search for
 * @param {String} filter any of the following filters: "hashtags", "posts", "comments", "users", "bookmarks"
 * @returns
 */

const search = async (keyword, filter) => {
    const response = await SEARCH_API.get(`${SEARCH_ENDPOINT}/search?q=${keyword}&filter=${filter}`);
    return response.data;
};

export { search };
