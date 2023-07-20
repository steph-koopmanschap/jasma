import { api } from "@/shared/api/axios";

const STREAM_API = api;
const STREAM_ENDPOINT = "/api/live";

export const getLiveStreams = async (category = "", page = 1) => {
    const res = await STREAM_API.get(`${STREAM_ENDPOINT}/list?category=${category}&page=${page}`);

    return res.data;
};
