import React, { useEffect, useState } from "react";
import { useToast } from "@/shared/model/index.js";
import { handleCheckIsFollowing, handleSetFollow, handleUnfollow } from "../model/userActions";

export function ToggleFollowBtn({ userID_two, username }) {
    const [isFollowing, setIsFollowing] = useState(false);

    const { notifyToast } = useToast();

    useEffect(() => {
        (async () => {
            const resIsFollow = await handleCheckIsFollowing(userID_two);
            if (resIsFollow.error) return notifyToast(resIsFollow.message, true);

            setIsFollowing(resIsFollow.isFollowing);
        })();
    }, [userID_two]); //old dependency: isFollowing (using isFollowing could cause an infinite loop)

    const follow = async () => {
        const resFollow = await handleSetFollow(userID_two);
        if (resFollow.error) return notifyToast(resFollow.message, true);
        setIsFollowing(true);
        console.log("resFollow from follow btn", resFollow);
        notifyToast(`You are now following ${username}.`);
    };

    const unfollow = async () => {
        const resUnfollow = await handleUnfollow(userID_two);
        if (resUnfollow.error) return notifyToast(resUnfollow.message, true);
        setIsFollowing(false);
        console.log("resUnfollow from follow btn", resUnfollow);
        notifyToast(`You have unfollowed ${username}.`);
    };

    return (
        <React.Fragment>
            {isFollowing ? (
                <button
                    className="formButtonDefault m-2"
                    onClick={unfollow}
                >
                    Unfollow
                </button>
            ) : (
                <button
                    className="formButtonDefault m-2"
                    onClick={follow}
                >
                    Follow
                </button>
            )}
        </React.Fragment>
    );
}
