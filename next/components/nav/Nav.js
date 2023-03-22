import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-solid-svg-icons'
import Brand from "../brand/Brand";
import SearchBar from "../SearchBar";
import ThemeSwitch from "../ThemeSwitch";
import NavProfile from "../profile/NavProfile";
import DropDownBtn from "../DropDownBtn";
import NotificationList from '../NotificationList';

const Nav = () => {
    return (
        <div className="flex justify-between p-2.5 mb-2 h-14 border-solid border border-gray-500">
            <div className="flex ml-2">
                <Brand />
            </div>

            <div className="flex">
                <SearchBar prevQuery="Search..." />
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
                <div className='flex self-center'>
                    <ThemeSwitch />
                </div>
            </div>
        </div>
    );
};

export default Nav;
