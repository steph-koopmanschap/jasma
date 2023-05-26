import Link from "next/link";

//The main footer

export function FooterMain() {
    return (
        <footer className="flex justify-center mt-20">
            <div className="">
                <Link
                    className="hover:text-sky-500 mr-2"
                    href="/about"
                >
                    About
                </Link>
                <Link
                    className="hover:text-sky-500 mr-2"
                    href="legal/privacy-policy"
                >
                    Privacy Policy
                </Link>
                <Link
                    className="hover:text-sky-500 mr-2"
                    href="legal/terms-of-service"
                >
                    Terms of Service
                </Link>
            </div>
        </footer>
    );
}
