import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import api from "../clientAPI/api.js";

export default function LogInOutBtn(props) {
    const router = useRouter();

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect( () => {
        setIsLoggedIn(window.localStorage.getItem('loggedInUserID') ? true : false);
    }, [isLoggedIn]);

    const logoutUser = async (e) => {
        const res = await api.logout();

        setIsLoggedIn(false);
        //Remove userID and username from localStorage
        window.localStorage.setItem('loggedInUserID', "");
        window.localStorage.setItem('loggedInUsername', "");
        window.localStorage.removeItem('loggedInUserID');
        window.localStorage.removeItem('loggedInUsername');
        //Force reload the page if on dashboard
        if (window.location.pathname === "/dashboard") {
            router.reload(window.location.pathname);
        }
        //else move to login page
        else {
            router.push(`/login`);
        }
    };

    //Choose which button (login btn or logout btn) to render based on logged in or logged out state
    return (
        <React.Fragment>
            {isLoggedIn ? (
                <button
                    className="formButtonDefault m-2"
                    onClick={logoutUser}
                >
                    Logout
                </button>
            ) : (
                <Link href="/login">
                    <button className="formButtonDefault m-2">Login</button>
                </Link>
            )}
        </React.Fragment>
    );
}
