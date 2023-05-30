import { useGetUserInfo } from "@/features/user";
import { useQueryClient } from "react-query";

export const Bio = ({ username }) => {
    //Get userID from query cache.
    const queryClient = useQueryClient();
    const res = queryClient.getQueryData(`${username}`);
    const userID = res?.user_id;

    const { status, isLoading, isError, data: dataUserInfo, error, refetch } = useGetUserInfo(userID);

    if (data) {
        console.log("data: ", data);
    }

    useEffect(() => {
        refetch();
    }, []);

    return (
        <div>
            <h1>NOTHING HERE YET.</h1>
            <p>{username}</p>
            <p>UserID: {userID}</p>

            {data?.success ? <UserBio {...data?.userInfo} /> : null}
        </div>
    );
};
