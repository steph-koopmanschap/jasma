import React, { useEffect } from 'react';
import { useRouter } from "next/router";
import api from "../clientAPI/api.js";
import HeaderMain from "../components/HeaderMain";
import FooterMain from "../components/FooterMain";



//Login page
export default function MarketPage() {
    const router = useRouter();
    
    useEffect( () => {
        //Check if user is already logged in. If no, redirect them to dashboard.
        //Because useEffect() itself can not be itself async, a self-executing async function is placed inside useEffect
        (async () => {
            const isLoggedIn = await api.checkAuthClientSide();
            if (isLoggedIn === false && !window.localStorage.getItem('loggedInUserID')) {
                router.replace('/dashboard');
            }
        })();
    }, []);

    return (
        <div className="">
            <HeaderMain />

            <main className="flex flex-col items-center justify-center w-full h-fit">
                <h1>Nothing here yet.</h1>
            </main>

            <FooterMain />
        </div>
    );
}
