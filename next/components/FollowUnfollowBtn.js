import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { toastSuccess } from "../utils/defaultToasts.js"
import api from "../clientAPI/api.js";

export default function FollowUnfollowBtn(props) {
    const { userID_two, username } = props;
    //const loggedInUserID = window.localStorage.getItem('loggedInUserID');
    const [isFollowing, setIsFollowing] = useState(false);

        //React Toast
        const toastId = useRef(null);
        const notify = (text) => (toastId.current = toastSuccess(text));
        const dismiss = () => toast.dismiss(toastId.current);

    useEffect(() => {
        (async () => {
            const resIsFollow = await api.checkIsFollowing(userID_two);
            console.log("resIsFollow from follow btn", resIsFollow);
            setIsFollowing(resIsFollow.isFollowing);
        })();
    }, [isFollowing]);

    const follow = async () => {
        const resFollow = await api.addFollower(userID_two);
        setIsFollowing(true);
        console.log("resFollow from follow btn", resFollow);
        return notify(`You are now following ${username}.`);
    }

    const unfollow = async () => {
        const resUnfollow = await api.removeFollower(userID_two);
        setIsFollowing(false);
        console.log("resUnfollow from follow btn", resUnfollow);
        return notify(`You have unfollowed ${username}.`);
    }

    return (
        <React.Fragment>
            {isFollowing ? 
                <button className='formButtonDefault m-2' onClick={unfollow}>Unfollow</button>
            : 
                <button className='formButtonDefault m-2' onClick={follow}>Follow</button> 
            }
        </React.Fragment>
    );
}
