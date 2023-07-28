import { api } from "@/shared/api/axios";

const STREAM_API = api;
const STREAM_ENDPOINT = "/api/live";

export const getLiveStreams = async (category = "", page = 1) => {
    const res = await STREAM_API.get(`${STREAM_ENDPOINT}/list?category=${category}&page=${page}`);

    return res.data;
};

export const getLiveSearchResults = async (searchTerm = "") => {
    const res = await STREAM_API.get(`${STREAM_ENDPOINT}/search?term=${searchTerm}`);

    return res.data;
};
