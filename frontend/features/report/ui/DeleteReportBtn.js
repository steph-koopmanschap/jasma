import { useToast } from "@/shared/model";
import { handleDeleteReport } from "../model/reportActions";

export const DeleteReportBtn = ({ onDelete, post_id }) => {
    const { notifyToast } = useToast();

    const deleteReport = async () => {
        const res = await handleDeleteReport(post_id);
        if (res.error) return notifyToast(res.message, true);
        onDelete();
    };

    return (
        <button
            className="bg-red-800 hover:bg-red-600 text-black font-bold py-2 px-4 rounded mr-4"
            onClick={deleteReport}
        >
            DELETE
        </button>
    );
};
