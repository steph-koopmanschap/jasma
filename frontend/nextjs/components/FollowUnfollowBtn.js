import React, { useEffect, useState } from "react";
import api from "../clientAPI/api.js";
import { useToast } from "@/shared/model/index.js";

export default function FollowUnfollowBtn(props) {
    const { userID_two, username } = props;
    //const loggedInUserID = window.localStorage.getItem('loggedInUserID');
    const [isFollowing, setIsFollowing] = useState(false);

    const { notifyToast } = useToast();

    useEffect(() => {
        (async () => {
            const resIsFollow = await api.checkIsFollowing(userID_two);
            setIsFollowing(resIsFollow.isFollowing);
        })();
    }, [userID_two]); //old dependency: isFollowing (using isFollowing could cause an infinite loop)

    const follow = async () => {
        const resFollow = await api.addFollower(userID_two);
        setIsFollowing(true);
        console.log("resFollow from follow btn", resFollow);
        notifyToast(`You are now following ${username}.`);
    };

    const unfollow = async () => {
        const resUnfollow = await api.removeFollower(userID_two);
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
