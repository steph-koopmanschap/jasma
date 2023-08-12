import {
    addFollower,
    changeUserRole,
    checkIsFollowing,
    getClientUser,
    getFollowers,
    getFollowing,
    getProfilePic,
    getUserID,
    getUserIDsByRole,
    removeFollower,
    uploadProfilePic
} from "@/entities/user";
import { createMultipartData, handleError } from "@/shared/utils";
import { useQuery } from "react-query";

const useGetUserPicture = (userID) => {
    return useQuery(
        [`profilePic_${userID}`],
        async () => {
            return await getProfilePic(userID);
        },
        {
            enabled: true,
            refetchOnWindowFocus: false,
            onError: handleError
        }
    );
};

const handleGetUser = async () => {
    try {
        const res = await getClientUser();
        return res;
    } catch (error) {
        return handleError(error);
    }
};

/**
 *
 * @param {String} userID_two id of user to follow??
 * @returns
 */

const handleSetFollow = async (userID_two) => {
    try {
        const res = await addFollower(userID_two);
        return res;
    } catch (error) {
        return handleError(error);
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
        return handleError(error);
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
        return handleError(error);
    }
};

/**
 *
 * @param {String} userID
 * @returns
 */

const useGetFollowers = (userID) =>
    useQuery(
        [`followers_${userID}`],
        async () => {
            return await getFollowers(userID);
        },
        {
            enabled: true,
            refetchOnWindowFocus: false,
            onError: handleError
        }
    );

/**
 *
 * @param {String} userID
 * @returns
 */

const useGetFollowing = (userID) =>
    useQuery(
        [`followees_${userID}`],
        async () => {
            return await getFollowing(userID);
        },
        {
            enabled: true,
            refetchOnWindowFocus: false,
            onError: handleError
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
        return handleError(error);
    }
};

/**
 *
 * @param {String} roleFilter
 * @returns
 */

const useGetUserIDsByRole = (roleFilter) =>
    useQuery(
        [`UserIDS_${roleFilter}`],
        async () => {
            return await api.getUserIDsByRole(roleFilter);
        },
        {
            enabled: true,
            refetchOnWindowFocus: false,
            onError: handleError
            //onSuccess: (result) => {setReports(result.reports)} //Load the response data into state upon succesful fetch
        }
    );

/**
 *
 * @param {String} user_id
 * @param {String} role
 * @returns
 */

const handleChangeUserRole = async (user_id, role) => {
    try {
        const response = changeUserRole(user_id, role);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

/**
 *
 * Get the userID from a username
 * @param {String} username
 * @returns
 */
const useGetUserID = (username) =>
    useQuery(
        [`${username}`],
        async () => {
            return await getUserID(username);
        },
        {
            enabled: true,
            refetchOnWindowFocus: false,
            onError: handleError
        }
    );

/**
 *
 * @param {String} userID
 * @returns
 */

const useGetUserInfo = (userID) =>
    useQuery(
        [`${username}`],
        async () => {
            return await api.getUserInfo(userID);
        },
        {
            enabled: true,
            refetchOnWindowFocus: false,
            onError: handleError
        }
    );

export {
    useGetUserPicture,
    handleGetUser,
    handleUnfollow,
    handleSetFollow,
    handleUploadUserPic,
    handleCheckIsFollowing,
    useGetFollowers,
    useGetFollowing,
    useGetUserID,
    handleChangeUserRole,
    useGetUserIDsByRole,
    useGetUserInfo
};
