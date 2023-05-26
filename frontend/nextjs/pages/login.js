import { useRouter } from "next/router";
import { useEffect } from "react";
import HeaderMain from "../widgets/header/index";
import FooterMain from "../widgets/footer/index";
import { checkAuthClientSide } from "@/entities/auth/index.js";
import LoginForm from "@/features/auth/login";

//Login page
export default function LoginPage() {
    const router = useRouter();

    useEffect(() => {
        //Check if user is already logged in. If yes, redirect them to dashboard.
        //Because useEffect() itself can not be itself async, a self-executing async function is placed inside useEffect
        (async () => {
            const isLoggedIn = await checkAuthClientSide();
            if (isLoggedIn === true && window.localStorage.getItem("loggedInUserID")) {
                router.replace("/dashboard");
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
