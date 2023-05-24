import { useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '../clientAPI/api.js';

//Check if a page requires auth.

//A custom react hook that can be placed in pages.
//If the user is not logged in it will redirect the user to the redirectUrl
const useRequireAuth = (redirectUrl) => {
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const isLoggedIn = await api.checkAuthClientSide();
            if (isLoggedIn === false && !window.localStorage.getItem('loggedInUserID')) {
                router.replace(redirectUrl);
            }
        };
        checkAuth();
    }, [router, redirectUrl]);
};

export default useRequireAuth;
