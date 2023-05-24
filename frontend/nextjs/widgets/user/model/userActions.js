import { getProfilePic } from "@/entities/user";

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

export { useGetUserPicture };
