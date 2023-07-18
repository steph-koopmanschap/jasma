import { api } from "@/shared/api/axios";

const STREAM_API = api;
const STREAM_ENDPOINT = "/api/live";

export const getLiveStreams = async (category = "") => {
    const res = await STREAM_API.get(`${STREAM_ENDPOINT}/list?category=${category}`);

    return res.data;
};
