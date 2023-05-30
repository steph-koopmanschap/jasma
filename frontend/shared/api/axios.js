import axios from "axios";

let baseURL = "";

const axiosInstance = axios.create({
    baseURL: baseURL,
    withCredentials: true,
    timeout: 9000 //Timeout response after 9 seconds
});

export const api = axiosInstance;
