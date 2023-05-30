import React from "react";
import { handleUnsubscribeHashtag } from "../model/hashtagActions";
import { useToast } from "@/shared/model";

export const UnsubHashtagBtn = () => {
    const { notifyToast } = useToast();

    const unsubscribeFromHashtag = async (e) => {
        const hashtag = e.target.value;
        console.log("hashtag", hashtag);
        const res = await handleUnsubscribeHashtag(hashtag);
        if (res.error) return notifyToast(res.message, true);

        console.log("res", res);
    };

    return (
        <button
            className="text-red-400 hover:text-red-600"
            value={`subbed_${hashtag.hashtag}`}
            onClick={unsubscribeFromHashtag}
        >
            x
        </button>
    );
};
