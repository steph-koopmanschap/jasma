import { useGetFollowing } from "@/features/user";
import UserLists from "../user-list";

export function FolloweesList({ userID }) {
    const { status, isLoading, isError, data, error, refetch } = useGetFollowing(userID);

    if (isLoading) {
        return <h1>Retrieving followees...</h1>;
    }

    if (isError) {
        return <h1>{error}</h1>;
    }

    return (
        <div>
            <p className="">This person is following: {data.followingCount}</p>
            <UserLists.UsersList users={data.following} />
        </div>
    );
}
