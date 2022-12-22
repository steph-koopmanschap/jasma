import React, { useState } from "react";
import { useQueryClient } from "react-query";
import Link from "next/link";
import { useRouter } from "next/router";
import api from "../clientAPI/api.js";

export default function LogInOutBtn(props) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [loginState, setLoginState] = useState(props.initialState);

    const logoutUser = async (e) => {
        const res = await api.logout();
        //Remove the user credentials from the query cache/storage
        queryClient.resetQueries("userCredentials", { exact: true });
        setLoginState(false);
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
            {loginState ? (
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
