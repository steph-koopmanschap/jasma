import React, { useEffect } from 'react';
import { useRouter } from "next/router";
import fetch from "node-fetch";
import api from "../clientAPI/api.js";
import HeaderMain from "../components/HeaderMain";
import FooterMain from "../components/FooterMain";
import LoginForm from "../components/LoginForm";

// export async function getServerSideProps({ req, res }) {

//     const response = await fetch("http://localhost:5000/api/auth/checkAuth", {
//         method: "POST",
//         headers: req.headers
//     });
//     const data = await response.json();
//     if (data.isAuth) {
//         return {
//             redirect: {
//                 destination: "/dashboard",
//                 permanent: false
//             }
//         };
//     }
//     return { props: {} };
// }

//Login page
export default function LoginPage() {
    const router = useRouter();
    
    useEffect( () => {
        //Check if user is already logged in. If yes, redirect them to dashboard.
        //Because useEffect() itself can not be itself async, a self-executing async function is placed inside useEffect
        (async () => {
            const isLoggedIn = await api.checkAuthClientSide();
            if (isLoggedIn === true && window.localStorage.getItem('loggedInUserID')) {
                router.replace('/dashboard');
            }
        })();
        
    }, []);

    return (
        <div className="">
            <HeaderMain />

            <section className="flex flex-col items-center justify-center w-full h-fit">
                <LoginForm />
            </section>

            <FooterMain />
        </div>
    );
}
