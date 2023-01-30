import Link from "next/link";
import HeaderMain from "../components/HeaderMain";
import FooterMain from "../components/FooterMain";
import DefaultHead from "../components/DefaultHead";

//The homepage
export default function Home() {

    return (
        <div className="">
            <DefaultHead />

            <HeaderMain />

            <main className="flex flex-col items-center justify-center w-full h-fit">
                
                <h1 className="text-xl mt-5 mb-5">To explore JASMA go to the <br />
                    <Link
                        className="text-xl formButtonDefault m-2 hover:text-sky-500 flex justify-center"
                        href="/dashboard"
                    >
                        Dashboard
                    </Link>
                </h1>

                <p className="text-2xl m-2">To help JASMA improve, please fill out 
                    <a 
                        className="text-blue-700 hover:text-blue-500" 
                        href="https://forms.gle/dQZQHFhyXrok78Wx5"
                        rel="nofollow noreferrer noopener"
                        target="_blank"
                    >
                        &nbsp; this Social Media Improvements Survey
                    </a>
                </p>

                <h2>DISCLAIMER:</h2>
                <p>
                    JAMSA is currently experimental and has no privacy protection or moderation systems or policies in place.  <br /> 
                    USE JASMA AT YOUR OWN RISK! <br />
                    Do not post or use any sensitive or private info on JASMA. <br />
                    Because JASMA is currently in development your account or posts may be deleted at any time. Nothing is guarenteed.
                </p>
            </main>

            <FooterMain />
        </div>
    );
}
