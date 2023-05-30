import { useToast } from "@/shared/model";
import { handleIgnoreReport } from "../model/reportActions";

export const IgnoreReportBtn = ({ post_id, onIgnore }) => {
    const { notifyToast } = useToast();

    const ignoreReport = async () => {
        const res = await handleIgnoreReport(currentActiveReport.post_id);
        if (res.error) return notifyToast(res.message, true);
        onIgnore();
    };

    return (
        <button
            className="bg-green-700 hover:bg-green-500 text-black font-bold py-2 px-4 rounded"
            onClick={ignoreReport}
        >
            IGNORE
        </button>
    );
};
