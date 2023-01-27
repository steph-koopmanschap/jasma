import React, { useState, useEffect } from 'react';
import Link from "next/link";
import api from "../clientAPI/api.js";
import ProfilePic from './ProfilePic';
import LogInOutBtn from './LogInOutBtn';

/* DONT KNOW WHAT TO CALL THIS COMPONENT */
export default function UserBox(props) {

    const userID = null;

    const [isLoggedIn, setIsLoggedIn] = useState(true);

    useEffect( () => {
        checkLoggedIn();
    }, []);

    const checkLoggedIn = async () => {
        // setIsLoggedIn(await api.checkAuth());
    }

    return ( 
        <div className="">
            <div className="flex flex-col items-end justify-end mr-4">
                {isLoggedIn ? 
                    (<React.Fragment>
                    <ProfilePic 
                        userid={userID} 
                        width="75" 
                        height="75" 
                    /> 
                    <Link href="/user/settings">
                            <button className="formButtonDefault m-2">
                                Settings
                            </button>
                    </Link>
                    </React.Fragment>)
                    : null}

                    <LogInOutBtn initialState={userID ? true : false} />
            </div>
        </div>
    );
}
