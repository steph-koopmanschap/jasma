import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import Link from "next/link";
import userState from "../../state/userState";
import jasmaApi from "../../clientAPI/api";
import DropDownBtn from '../DropDownBtn.js';
import ProfilePic from "../ProfilePic";
import LogInOutBtn from '../LogInOutBtn';

const NavProfile = () => {
    const [user, setUser] = useRecoilState(userState);
    
    useEffect(() => {
        (async () => {
            const data = await jasmaApi.getClientUser();
            if (data.success) {
                setUser(data.user);
            }
            else {
                setUser(null);
            }
        })()
    }, []);

    return (
        <div>
            <DropDownBtn 
                style="flex flex-col" 
                dropDownStyle="flex flex-col p-2 m-1 w-1/2 bg-gray-900 place-self-end"
                addIcon={false}
                replacementIcon={(
                    <React.Fragment>
                    <ProfilePic 
                        userID={user ? user.user_id : null } 
                        width="30" 
                        height="30" 
                    />
                    </React.Fragment>)}
            >
                {user ?
                    (
                    <React.Fragment>
                    <Link href={`/user/${user.username}`} >Profile page</Link>
                    <Link href="/user/settings">
                                <button className="formButtonDefault m-2">
                                    Settings
                                </button>
                    </Link>
                    </React.Fragment>
                    )
                    : null
                }

                <LogInOutBtn initialState={user ? true : false} />
            </DropDownBtn>
        </div>
    );        
}

export default NavProfile;