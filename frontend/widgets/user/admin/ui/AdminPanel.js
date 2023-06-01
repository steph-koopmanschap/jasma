import { SearchUserForm, UserAdminItem, UserRolesOptions, getUserID } from "@/entities/user/index.js";
import { ChangeRole } from "@/features/user/index.js";
import { useGetUserIDsByRole } from "@/features/user/model/userActions.js";
import { useToast } from "@/shared/model/index.js";
import { useRef, useState } from "react";

/*
    This is a page for administrators to manage moderators / account roles.
*/

export function AdminPanel() {
    const [roleFilter, setRoleFilter] = useState("mod");
    const [searchUserBoxValue, setSearchUserBoxValue] = useState("");
    const { notifyToast } = useToast();
    //Use useRef instead?
    //Contains the the userID related to the username in the searchUserBoxValue
    //const [searchedUser, setSearchedUser] = useState("");
    const searchedUser = useRef("");

    const { isSuccess, isLoading, isError, data, error, refetch } = useGetUserIDsByRole(roleFilter);

    if (isLoading) {
        return <h1>Loading...</h1>;
    }

    if (isError) {
        return <h1>{error.message}</h1>;
    }

    if (data.success === false) {
        return <h1>{data.message}</h1>;
    }

    const searchUser = async (username) => {
        try {
            console.log("username:", username);
            setSearchUserBoxValue(username);
            const res = await getUserID(username);
            searchedUser.current = res.user_id;
            console.log("searchedUser.current", searchedUser.current);
        } catch (error) {
            notifyToast(error.message, true);
        }
    };

    const filterRoles = () => {
        const newFilter = document.getElementById("roleFilterBtn").value;
        console.log("newFilter", newFilter);
        setRoleFilter(newFilter);
        refetch;
    };

    return (
        <div className="mt-4">
            <h1 className="text-xl text-center mt-4">JASMA ADMINISTRATION PANEL</h1>

            <SearchUserForm onSubmit={searchUser} />
            <p className="">Change role of {searchUserBoxValue} to:</p>
            <ChangeRole userId={searchedUser.current} />

            <select
                name="roleFilter"
                id="roleFilterBtn"
                onChange={filterRoles}
            >
                <option value="">--Filter by role--</option>
                <UserRolesOptions />
            </select>

            <h2 className="mt-2 mb-2">Current {roleFilter}s</h2>

            <div className="flex flex-col">
                {data.users.map((user) => (
                    <UserAdminItem
                        key={user.user_id}
                        user={user}
                        adminAction={<ChangeRole userId={user.user_id} />}
                    />
                ))}
            </div>
        </div>
    );
}
