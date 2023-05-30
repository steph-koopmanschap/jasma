import { checkAuthClientSide, checkAuthUserRole } from "@/entities/auth";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { handleError } from "@/shared/utils";

/**
 *
 * @param {String} redirectPath relative path if user is NOT authorized. Example: "/cms/cms-login". Default is home page: '/'
 * @param {String} successRedirectPath relative path if user is authorized. Example: "/cms/cms-login"
 */

const useCheckAuthClientSide = async (redirectPath = "/", successRedirectPath) => {
    const router = useRouter();
    useEffect(() => {
        const callApi = async () => {
            try {
                const isLoggedIn = await checkAuthClientSide();
                if (
                    isLoggedIn === true &&
                    window.localStorage.getItem("loggedInUserID") &&
                    successRedirectPath !== undefined
                ) {
                    router.replace(successRedirectPath);
                }
            } catch (error) {
                router.replace(redirectPath);
            }
        };
        callApi();
    }, []);
};

const handleCheckAuthUserRole = async () => {
    try {
        const response = await checkAuthUserRole();
        return response;
    } catch (error) {
        return handleError(error);
    }
};

export { useCheckAuthClientSide, handleCheckAuthUserRole };
