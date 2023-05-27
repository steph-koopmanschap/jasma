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

const handleGetFollowers = async (userID) => {
    try {
        const res = await getFollowers(userID);
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

const handleGetFollowing = async (userID) => {
    try {
        const res = await getFollowing(userID);
        return res;
    } catch (error) {
        return { error: true, message: "Error." + error };
    }
};

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
    handleGetFollowers,
    handleGetFollowing,
    handleSetFollow,
    handleUnfollow
};
