import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

import Brand from "@/widgets/brand";
import { DropDownBtn } from "@/shared/ui";
import { ThemeSwitch } from "@/features/theme";
import { NavProfile } from "@/widgets/user";
import { NotificationList } from "@/widgets/notification-list";
import { SearchInput } from "@/features/search";

const Nav = () => {
    return (
        <nav className="flex justify-between p-2.5 mb-2 h-14 border-solid border border-gray-500">
            <div className="flex ml-2">
                <Brand />
            </div>

            <div className="flex">
                <SearchInput prevQuery="Search..." />
            </div>

            <div className="flex">
                <DropDownBtn
                    style="flex flex-col hover:text-sky-400"
                    dropDownStyle="flex flex-col p-2 m-1 w-1/2 bg-gray-900 place-self-end "
                    addIcon={false}
                    replacementIcon={<FontAwesomeIcon icon={faBell} />}
                >
                    <NotificationList />
                </DropDownBtn>
                <NavProfile />
                <div className="flex self-center">
                    <ThemeSwitch />
                </div>
            </div>
        </nav>
    );
};

export default Nav;
