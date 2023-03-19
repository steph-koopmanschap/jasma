import React, { useEffect } from 'react';
import { useRouter } from "next/router";
import api from "../../clientAPI/api.js";

export default function CMS_Login() {

    const router = useRouter();
    
    useEffect( () => {
        //Check if user is already logged in. If no, redirect them back to cms login page.
        //Because useEffect() itself can not be itself async, a self-executing async function is placed inside useEffect
        (async () => {
            const isLoggedIn = await api.checkAuthClientSide();
            // Replace above line of code with below code when page is done.
            //const res = await api.checkAuthUserRole();
            // let loggedIn = false;
            // if (res.mod || res.admin) {
            //     isLoggedIn = true;
            // }
            if (isLoggedIn === false) {
                router.replace('/cms/cms-login');
            }
        })();
        
    }, []);

    return (
    <div>
        <h1 className="text-xl">JASMA CONTENT DELETION POLICY</h1>
        <p>Nothing here yet...</p>
    </div>
    );
}
