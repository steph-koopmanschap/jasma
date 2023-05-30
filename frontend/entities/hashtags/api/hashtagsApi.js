import { api } from "@/shared/api/axios";

const HASHTAG_API = api;
const HASHTAG_ENDPOINT = "/api/hastags";

const getSubscribedHashtags = async () => {
    const response = await HASHTAG_API.get(`${HASHTAG_ENDPOINT}/getSubscribedHashtags`);
    return response.data;
};

/**
 *
 * @param {String} hashtags hashtags in string format
 * @returns
 */

const subscribeToHashtags = async (hashtags) => {
    const response = await HASHTAG_API.post(`${HASHTAG_ENDPOINT}/subscribeToHashtags`, {
        hashtags: hashtags
    });
    return response.data;
};

/**
 *
 * @param {String} hashtag hashtag in string format
 * @returns
 */
const unsubscribeFromHashtag = async (hashtag) => {
    const response = await HASHTAG_API.delete(`${HASHTAG_ENDPOINT}/unsubscribeFromHashtag/${hashtag}`);
    return response.data;
};

export { unsubscribeFromHashtag, subscribeToHashtags, getSubscribedHashtags };
