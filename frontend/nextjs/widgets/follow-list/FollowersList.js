import { useQuery } from "react-query";
import UserLists from "../user-list/index.js";
import { useGetFollowers } from "@/features/user/index.js";

export function FollowersList({ userID }) {
    const { status, isLoading, isError, data, error, refetch } = useGetFollowers(userID);

    if (isLoading) {
        return <h1>Retrieving followers...</h1>;
    }

    if (isError) {
        return <h1>{error}</h1>;
    }

    return (
        <div>
            <p className="">People that follow this person: {data?.followersCount}</p>
            <UserLists.UsersList users={data?.followers} />
        </div>
    );
}
