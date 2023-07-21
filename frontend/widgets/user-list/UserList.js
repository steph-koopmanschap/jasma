import { useEffect, useState } from "react";
import UserWidgets from "../user";
import { UserListItemShell } from "@/entities/user";
import { ToggleFollowBtn } from "@/features/user";

export function UsersList({ users }) {
    const [loggedInUserID, setLoggedInUserID] = useState(null);

    useEffect(() => {
        setLoggedInUserID(window.localStorage.getItem("loggedInUserID"));
    }, []);

    return (
        <div>
            {users?.map((user) => (
                <UserListItemShell
                    followAction={
                        <>
                            {!!loggedInUserID ? (
                                <ToggleFollowBtn
                                    userID_two={user.user_id}
                                    username={user.username}
                                />
                            ) : null}
                        </>
                    }
                    profilePic={
                        <UserWidgets.ProfilePic
                            userID={user.user_id}
                            height={40}
                            width={40}
                        />
                    }
                />
            ))}
        </div>
    );
}
