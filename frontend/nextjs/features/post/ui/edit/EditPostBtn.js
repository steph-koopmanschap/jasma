import React from "react";
import { handleEditPost } from "../../model/actions";
import { useToast } from "@/shared/model";

export const EditPostBtn = ({ post_id }) => {
    const { notifyToast } = useToast();

    const editPost = async () => {
        const res = await handleEditPost(post_id);

        if (res.error) {
            notifyToast("Error." + res.message);
        } else {
            notifyToast("Successfully edited");
        }
    };

    return (
        <button
            className="formButtonDefault outline-white border my-1"
            onClick={editPost}
        >
            Edit
        </button>
    );
};
