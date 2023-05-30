import { useToast } from "@/shared/model";
import { removeBookmark } from "../model/actions";

export const RemoveBookmark = (props) => {
    const { post_id } = props;
    const { notifyToast } = useToast();

    const handleRemoveBookmark = async () => {
        const res = await removeBookmark(post_id);
        if (res.error) return notifyToast(res.message, true);
        notifyToast("Bookmark removed.");
    };

    return (
        <button
            className="formButtonDefault py-2 px-2 m-2 outline-white border"
            onClick={handleRemoveBookmark}
        >
            Remove bookmark
        </button>
    );
};
