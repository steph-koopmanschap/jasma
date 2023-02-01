import { useEffect, useState } from "react";
import Link from "next/link";
import ProfilePic from "./ProfilePic";
import FollowUnfollowBtn from "./FollowUnfollowBtn";

export default function UsersList(props) {
    const { users } = props;

    const [loggedInUserID, setLoggedInUserID] = useState(null);

    useEffect( () => {
        setLoggedInUserID(window.localStorage.getItem('loggedInUserID'));
    }, []);

    return ( 
        <div>
            {users.map((user) => (
            <div 
                className="flex mx-auto w-1/5 p-2 m-2 bg-gray-600" 
                key={user.user_id}
            >
                <ProfilePic userID={user.user_id} width={40} height={40} />
                <Link className="font-bold mr-4" href={`/user/${user.username}`}>{user.username}</Link>
                <div className="">
                    {loggedInUserID ? 
                        <FollowUnfollowBtn userID_two={user.user_id} username={user.username} />
                    : null}
                </div>
            </div>
        ))}
    </div>
    );
}
