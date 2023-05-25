import { useToast } from "@/shared/model";
import { handleEditComment } from "../model/commentActions";

export const EditCommentButton = ({ comment_id }) => {
    const { notifyToast } = useToast();

    const editComment = async () => {
        const res = await handleEditComment(comment_id);

        if (!res.error) {
            notifyToast("Commented edited!");
        } else {
            notifyToast(res.message);
        }
    };

    return (
        <button
            className="formButtonDefault outline-white border my-1"
            onClick={EditComment}
        >
            Edit
        </button>
    );
};
