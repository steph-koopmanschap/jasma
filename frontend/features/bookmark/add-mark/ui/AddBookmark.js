import { useToast } from "@/shared/model";
import React from "react";
import { addPostBookMark } from "../model/actions";

export const AddBookmark = ({ post_id }) => {
    const { notifyToast } = useToast();

    const bookmarkPost = async () => {
        const res = await addPostBookMark(post_id);
        if (res.error) return notifyToast(res.message, true);
        notifyToast("Post added to bookmarks.");
    };
    return (
        <button
            className="formButtonDefault outline-white border my-1"
            onClick={bookmarkPost}
        >
            Bookmark
        </button>
    );
};
