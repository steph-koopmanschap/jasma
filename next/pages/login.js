// import { getSession } from "../session.js";
import HeaderMain from "../components/HeaderMain";
import FooterMain from "../components/FooterMain";
import LoginForm from "../components/LoginForm";
// import axios from "axios";
import fetch from "node-fetch";
// import { checkAuth } from "../session.js";
// import signature from "cookie-signature";
export async function getServerSideProps({ req, res }) {
    const response = await fetch("http://localhost:5000/api/auth/checkAuth", {
        method: "POST",
        headers: req.headers
    });
    const data = await response.json();
    if (data.isAuth) {
        return {
            redirect: {
                destination: "/dashboard",
                permanent: false
            }
        };
    }
    return { props: {} };
}
//Login page
export default function LoginPage() {
    return (
        <div className="">
            <HeaderMain />

            <main className="flex flex-col items-center justify-center w-full h-fit">
                <LoginForm />
            </main>

            <FooterMain />
        </div>
    );
}
