import Link from "next/link";
import Logo from "./Logo";
import BrandName from "./BrandName";

function Brand() {

    return (
        <Link href="/">
            <div className="flex w-full h-full text-2xl">
                <Logo />
                <BrandName />
            </div>
        </Link>
    );
}

export default Brand;
