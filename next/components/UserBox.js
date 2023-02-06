import React, { useState, useEffect } from 'react';
import Link from "next/link";
import ProfilePic from './ProfilePic';
import LogInOutBtn from './LogInOutBtn';

/* DONT KNOW WHAT TO CALL THIS COMPONENT */
export default function UserBox(props) {
    
    const [userID, setUserID] = useState(null)
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect( () => {
        setUserID(window.localStorage.getItem('loggedInUserID'));
        setIsLoggedIn(userID ? true : false);
    }, [isLoggedIn, userID]);

    return ( 
        <div className="">
            <div className="flex flex-col items-end justify-end mr-4">
                {isLoggedIn ? 
                    (<React.Fragment>
                    <Link href={`/user/${window.localStorage.getItem('loggedInUsername')}`} >
                        <ProfilePic 
                            userID={userID} 
                            width="75" 
                            height="75" 
                        /> 
                    </Link>
                    <Link href="/user/settings">
                            <button className="formButtonDefault m-2">
                                Settings
                            </button>
                    </Link>
                    </React.Fragment>)
                    : null}

                    <LogInOutBtn initialState={isLoggedIn} />
            </div>
        </div>
    );
}
