import Logo from "./Logo";
import BrandName from "./BrandName";
import Link from "next/link";
import styles from "./Brand.module.css";
function Brand() {
    return (
        <Link href="/">
            <div className={styles.brand}>
                <Logo />
                <BrandName />
            </div>
        </Link>
    );
}

export default Brand;
