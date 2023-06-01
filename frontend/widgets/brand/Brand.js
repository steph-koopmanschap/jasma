import Link from "next/link";
import Logo from "./ui/Logo";
import BrandName from "./ui/BrandName";

export function Brand() {
    return (
        <Link href="/">
            <div className="flex w-full h-full text-2xl">
                <Logo />
                <BrandName />
            </div>
        </Link>
    );
}
