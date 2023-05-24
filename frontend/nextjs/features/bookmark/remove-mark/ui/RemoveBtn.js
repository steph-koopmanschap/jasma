import { useToast } from "@/shared/model/hooks";
import { removeBookmark } from "../model/actions";

export const RemoveBookmark = (props) => {
    const { post_id } = props;
    const { notifyToast } = useToast();

    const handleRemoveBookmark = async () => {
        const res = await removeBookmark(post_id);
        if (res.success) {
            notifyToast("Bookmark has been removed.");
        } else {
            notifyToast("Error. " + res);
        }
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
