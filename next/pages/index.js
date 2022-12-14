import Link from "next/link";
import HeaderMain from "../components/HeaderMain";
import FooterMain from "../components/FooterMain";
import LoginForm from "../components/LoginForm";
import SignUpForm from "../components/SignUpForm";
import DefaultHead from "../components/DefaultHead";

//The homepage
export default function Home() {

    return (
        <div className="">
            <DefaultHead />

            <HeaderMain />

            <main className="flex flex-col items-center justify-center w-full h-fit">
                <Link
                    className="hover:text-sky-500"
                    href="/dashboard"
                >
                    Dashboard
                </Link>
                <LoginForm />
                <SignUpForm />
            </main>

            <FooterMain />
        </div>
    );
}
