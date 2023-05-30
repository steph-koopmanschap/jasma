import { useToast } from "@/shared/model";
import { handleDeleteComment } from "../model/commentActions";

export const DeleteCommentButton = ({ comment_id }) => {
    const { notifyToast } = useToast();

    const deleteComment = async () => {
        const res = await handleDeleteComment(comment_id);

        if (!res.error) {
            notifyToast("Comment deleted!");
        } else {
            notifyToast(res.message, true);
        }
    };

    return (
        <button
            className="formButtonDefault outline-white border my-1"
            onClick={deleteComment}
        >
            Delete
        </button>
    );
};
