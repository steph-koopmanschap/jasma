import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { handleLogout } from "../model/logoutActions.js";
import { useToast } from "@/shared/model/index.js";

export function LogInOutBtn(props) {
    const router = useRouter();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { notifyToast } = useToast();

    useEffect(() => {
        setIsLoggedIn(window.localStorage.getItem("loggedInUserID") ? true : false);
    }, [isLoggedIn]);

    const logoutUser = async (e) => {
        const res = await handleLogout();

        if (res.error) return notifyToast(res.message);

        setIsLoggedIn(false);

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
