import React, { useEffect } from 'react';
import { useRouter } from "next/router";
import api from "../../clientAPI/api.js";

/*
    This is a page for administrators to manage moderators.
*/

export default function AdminPortal() {

    const router = useRouter();
    
    useEffect( () => {
        //Check if user is already logged in. If yes, redirect them to admin portal.
        //Because useEffect() itself can not be itself async, a self-executing async function is placed inside useEffect
        (async () => {
            const isLoggedIn = await api.checkAuthClientSide(); 
            // Replace above line of code with below 2 lines of code when page is done.
            //const res = await api.checkAuthUserRole();
            //const isLoggedIn = res.admin;
            if (isLoggedIn === true && window.localStorage.getItem('loggedInUserID')) {
                router.replace('/cms/admin-portal');
            }
        })();
        
    }, []);

    return (
    <div className='mt-4'>
        <h1 className="text-xl text-center mt-4">JASMA ADMINISTRATION PORTAL</h1>
        <h2>Nothing here yet...</h2>
    </div>
    );
}
