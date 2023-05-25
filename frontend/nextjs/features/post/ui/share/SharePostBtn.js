import React from "react";
import { handleSharePost } from "../../model/actions";
import { useToast } from "@/shared/model";

export const SharePostBtn = ({ post_id }) => {
    const { notifyToast } = useToast();
    const sharePost = () => {
        handleSharePost(post_id)
            .then(() => notifyToast("Copied to clipboard"))
            .catch((err) => notifyToast("Error." + err));
    };

    return (
        <p
            className="formButtonDefault outline-black border my-1"
            onClick={sharePost}
        >
            Copy link
        </p>
    );
};
