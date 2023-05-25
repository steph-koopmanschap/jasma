import { useToast } from "@/shared/model";
import React from "react";
import { handleDeletePost } from "../../model/actions";

export const DeletePostBtn = ({ post_id }) => {
    const { notifyToast } = useToast();

    const deletePost = async () => {
        const res = await handleDeletePost(post_id);
        if (res.error) {
            notifyToast("Error." + res.message);
        } else {
            notifyToast("Successfully deleted");
        }
    };

    return (
        <button
            className="formButtonDefault outline-white border my-1"
            onClick={deletePost}
        >
            Delete
        </button>
    );
};
