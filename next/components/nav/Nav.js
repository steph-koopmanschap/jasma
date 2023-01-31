import Brand from "../brand/Brand";
import SearchBar from "../search/SearchBar";
import ThemeSwitch from "../ThemeSwitch";
import NavProfile from "../profile/NavProfile";
import styles from "./Nav.module.css";
const Nav = () => {
    return (
        <div className={styles.nav}>
            <div className={styles["nav-left"]}>
                <Brand />
            </div>

            <div className={styles["nav-middle"]}>
                <SearchBar />
            </div>

            <div className={styles["nav-right"]}>
                <ThemeSwitch />
                <NavProfile />
            </div>
        </div>
    );
};

export default Nav;
