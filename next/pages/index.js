import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import HeaderMain from "../components/HeaderMain";
import FooterMain from "../components/FooterMain";
import DefaultHead from "../components/DefaultHead";
import themes from "../styles/themes";
import { ThemeProvider } from "styled-components";
import GlobalStyles from "../styles/GlobalStyles";

export default function Home({ initialTheme }) {
    return (
        <>
            <HeaderMain />

            <main className={`flex flex-col items-center justify-center w-full h-fit jprimary`}>
                <h1 className="text-xl mt-5 mb-5 jprimary">
                    To explore JASMA go to the <br />
                    <Link
                        className="text-xl formButtonDefault m-2 hover:text-sky-500 flex justify-center"
                        href="/dashboard"
                    >
                        Dashboard
                    </Link>
                </h1>

                <p>
                    To start you can <Link className="text-blue-700 hover:text-blue-500 font-bold" href="/register">register</Link> an account.
                </p>
                <p className="mb-2">
                    Or <Link className="text-blue-700 hover:text-blue-500 font-bold" href="/login">login</Link> if you already have an accont.
                </p>

                <p className="text-2xl m-2 primary">
                    To help JASMA improve, please fill out
                    <a
                        className="text-blue-700 hover:text-blue-500"
                        href="https://forms.gle/dQZQHFhyXrok78Wx5"
                        rel="nofollow noreferrer noopener"
                        target="_blank"
                    >
                        &nbsp; this Social Media Improvements Survey
                    </a>
                </p>

                <h2 className="font-bold">DISCLAIMER:</h2>
                <p>
                    JAMSA is currently experimental and has no privacy protection or moderation systems or policies in
                    place. <br />
                    <span className="font-bold text-red-600">USE JASMA AT YOUR OWN RISK!</span> <br />
                    Do not post or use any sensitive or private info on JASMA. <br />
                    Because JASMA is currently in development your account or posts may be deleted at any time. Nothing
                    is guarenteed.
                </p>
            </main>

            <FooterMain />
        </>
    );
}
