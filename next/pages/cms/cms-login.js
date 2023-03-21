import React, { useEffect } from 'react';
import { useRouter } from "next/router";
import api from "../../clientAPI/api.js";

export default function CMS_Login() {

    const router = useRouter();
    
    useEffect( () => {
        //Check if user is already logged in. If yes, redirect them to cms portal.
        //Because useEffect() itself can not be itself async, a self-executing async function is placed inside useEffect
        (async () => {
            const isLoggedIn = await api.checkAuthClientSide(); 
            // Replace above line of code with below 2 lines of code when page is done.
            //const res = await api.checkAuthUserRole();
            // if (res.mod) {
            //     router.replace('/cms/cms-panel');
            // }
            // else if (res.admin) {
            //     router.replace('/cms/admin-panel');
            // }
            if (isLoggedIn === true && window.localStorage.getItem('loggedInUserID')) {
                router.replace('/cms/cms-panel');
            }
        })();
        
    }, []);

    return (
    <div>
        <h1 className="text-xl text-center mt-4">JASMA CONTENT MODERATION SYSTEM (J-CMS) LOGIN</h1>
        <h2>Nothing here yet...</h2>
    </div>
    );
}
