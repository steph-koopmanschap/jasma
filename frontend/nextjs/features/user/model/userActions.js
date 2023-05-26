import { getClientUser, getProfilePic } from "@/entities/user";
import { useQuery } from "react-query";

const useGetUserPicture = (userID) => {
    return useQuery(
        [`profilePic_${userID}`],
        async () => {
            return await getProfilePic(userID);
        },
        {
            enabled: true,
            refetchOnWindowFocus: false
        }
    );
};

const handleGetUser = async () => {
    try {
        const res = await getClientUser();
        return res;
    } catch (error) {
        return { error: true, message: "Error." + error };
    }
};

export { useGetUserPicture, handleGetUser };
