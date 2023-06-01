import { api } from "@/shared/api/axios";

const REPORT_API = api;
const REPORT_ENDPOINT = "/api/reports";

/**
 *
 * @param {String} post_id
 * @param {String} report_reason
 * @returns
 */

const createReport = async (post_id, report_reason) => {
    const response = await REPORT_API.post(`${REPORT_ENDPOINT}/createReport`, {
        post_id: post_id,
        report_reason: report_reason
    });
    return response.data;
};

/**
 *
 * @param {Number} limit If limit is 0 then all reports are fetched. Default is 0
 * @returns
 */
const getReports = async (limit = 0) => {
    const response = await REPORT_API.get(`${REPORT_ENDPOINT}/getReports?limit=${limit}`);
    return response.data;
};

/**
 *
 * @param {String} post_id
 * @returns
 */

const deleteReport = async (post_id) => {
    const response = await REPORT_API.delete(`${REPORT_ENDPOINT}/deleteReport/${post_id}`);
    return response.data;
};

const ignoreReport = async (post_id) => {
    const res = await REPORT_API.ignoreReport(`${REPORT_ENDPOINT}/ignoreReport/${post_id}`);
    return res.data;
};

export { deleteReport, createReport, getReports, ignoreReport };
