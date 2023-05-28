import {
    addFollower,
    checkIsFollowing,
    getClientUser,
    getFollowers,
    getFollowing,
    getProfilePic,
    removeFollower,
    uploadProfilePic
} from "@/entities/user";
import { createMultipartData } from "@/shared/utils";
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

/**
 *
 * @param {String} userID_two id of user to follow??
 * @returns
 */

const handleSetFollow = async (userID_two) => {
    try {
        const res = await addFollower();
        return res;
    } catch (error) {
        return { error: true, message: "Error." + error };
    }
};

/**
 *
 * @param {String} userID_two id of user to follow??
 * @returns
 */

const handleUnfollow = async (userID_two) => {
    try {
        const res = await removeFollower();
        return res;
    } catch (error) {
        return { error: true, message: "Error." + error };
    }
};

/**
 *
 * @param {*} file image from user's input
 * @returns
 */

const handleUploadUserPic = async (file) => {
    try {
        const multipartData = createMultipartData({ context: "avatar" }, file);
        const res = await uploadProfilePic(multipartData);
        return res;
    } catch (error) {
        return { error: true, message: "Error." + error };
    }
};

/**
 *
 * @param {String} userID
 * @returns
 */

const useGetFollowers = async (userID) =>
    useQuery(
        [`followers_${userID}`],
        async () => {
            return await api.getFollowers(userID);
        },
        {
            enabled: true,
            refetchOnWindowFocus: false
        }
    );

if (isLoading) {
    return <h1>Retrieving followers...</h1>;
}

if (isError) {
    return <h1>{error}</h1>;
}

/**
 *
 * @param {String} userID
 * @returns
 */

const useGetFollowing = async (userID) =>
    useQuery(
        [`followees_${userID}`],
        async () => {
            return await api.getFollowing(userID);
        },
        {
            enabled: true,
            refetchOnWindowFocus: false
        }
    );

/**
 *
 * @param {String} userID_two  id of user to check
 * @returns
 */

const handleCheckIsFollowing = async (userID_two) => {
    try {
        const res = await checkIsFollowing(userID_two);
        return res;
    } catch (error) {
        return { error: true, message: "Error." + error };
    }
};

export {
    useGetUserPicture,
    handleGetUser,
    handleUnfollow,
    handleSetFollow,
    handleUploadUserPic,
    handleCheckIsFollowing,
    useGetFollowers,
    useGetFollowing,
    handleSetFollow,
    handleUnfollow
};
