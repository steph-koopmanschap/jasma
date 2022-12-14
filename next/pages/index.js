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

                <p className="text-2xl m-2">To help JASMA improve, please fill out 
                    <a 
                        className="text-blue-700 hover:text-blue-500" 
                        href="https://forms.gle/dQZQHFhyXrok78Wx5"
                        rel="nofollow"
                        target="_blank"
                    >
                        &nbsp; this Social Media Improvements Survey
                    </a>
                </p>


                <LoginForm />
                <SignUpForm />
            </main>

            <FooterMain />
        </div>
    );
}
