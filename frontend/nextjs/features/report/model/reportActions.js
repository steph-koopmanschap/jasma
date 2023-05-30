import { deleteReport, createReport, getReports, ignoreReport } from "@/entities/report";
import { handleError } from "@/shared/utils";
import { useQuery } from "react-query";
/**
 *
 * @param {String} post_id
 */

const handleDeleteReport = async (post_id) => {
    try {
        const res = await deleteReport(post_id);
        return res;
    } catch (error) {
        return handleError(error);
    }
};

/**
 *
 * @param {String} postID
 * @param {String} report_reason  string describing report reason
 * @returns
 */

const handleCreateReport = async (postID, report_reason) => {
    try {
        const res = await createReport(postID, report_reason);
        // handle store logic
        return res;
    } catch (error) {
        return handleError(error);
    }
};

/**
 *
 * @param {String} post_id
 */

const handleIgnoreReport = async (post_id) => {
    try {
        const res = await ignoreReport(post_id);
        return res;
    } catch (error) {
        return handleError(error);
    }
};

/**
 *
 * @param {Number} limit If limit is 0 then all reports are fetched. Default is 0
 * @returns
 */

const useGetReports = (limit = 0, onSuccess) =>
    useQuery(
        [`reportsPosts`],
        async () => {
            return await getReports(limit);
        },
        {
            enabled: true,
            refetchOnWindowFocus: false,
            onSuccess,
            onError: handleError
        }
    );

export { handleDeleteReport, handleCreateReport, handleIgnoreReport, useGetReports };
