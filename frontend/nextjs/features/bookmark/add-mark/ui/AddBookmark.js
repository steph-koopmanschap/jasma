import { useToast } from "@/shared/model/hooks";
import React from "react";
import { addPostBookMark } from "../model/actions";

export const AddBookmark = ({ post_id }) => {
    const { notifyToast } = useToast();

    const bookmarkPost = async () => {
        const res = await addPostBookMark(post_id);
        if ((res.message = "success")) {
            notifyToast("Post has been bookmarked.");
        } else {
            notifyToast("Error. " + res);
        }
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
