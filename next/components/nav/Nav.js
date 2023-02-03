import Brand from "../brand/Brand";
import SearchBar from "../SearchBar";
import ThemeSwitch from "../ThemeSwitch";
import NavProfile from "../profile/NavProfile";

const Nav = () => {
    return (
        <div className="flex justify-between p-2.5 h-14 border-solid border border-gray-500">
            <div className="flex">
                <Brand />
            </div>

            <div className="flex">
                <SearchBar prevQuery="Search..." />
            </div>

            <div className="flex">
                <ThemeSwitch />
                <NavProfile />
            </div>
        </div>
    );
};

export default Nav;
