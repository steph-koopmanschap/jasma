import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from "../../clientAPI/api.js";
import HeaderMain from '../../components/HeaderMain';
import ProfilePic from '../../components/ProfilePic';
import ChangePasswordForm from '../../components/ChangePasswordForm';


//import FileUploader from "../../file-upload/FileUploader";

//The Settings profile
export default function Settings(props) {
    const router = useRouter();

    const [file, setFile] = useState(null);

    const [userID, setUserID] = useState(null)
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect( () => {
        setUserID(window.sessionStorage.getItem('loggedInUserID'));
        setIsLoggedIn(userID ? true : false);

        console.log("userID from settings page?");
        console.log(userID);
        console.log("isLoggedIn from settings page?");
        console.log(isLoggedIn, userID);

        // if(isLoggedIn === false) {
        //     router.replace("/dashboard");
        // }

    }, [isLoggedIn]);

    return (
        <div className='flex flex-col items-center'>
            <HeaderMain /> 

            <React.Fragment>
            <h1 className='text-2xl text-center'>Settings</h1>

            <p>Your current profile picture: </p>
            <ProfilePic 
                userID={userID}
                width="250"
                height="250"
            />
            <p>Change profile picture:</p>
            {/* <FileUploader
                file={file}
                setFile={setFile}
            /> */}
            <ChangePasswordForm />

            </React.Fragment>
        </div>
    );
}

/* ADD THIS CODE LATER (DO NOT DELETE) */

/*

            {isLoggedIn ? (
            <React.Fragment>
            <h1 className='text-2xl'>Settings</h1>

            <p>Your current profile picture: </p>
            <ProfilePic 
                userID={userID}
                width="250"
                height="250"
            />
            <p>Change profile picture:</p>
            {/* <FileUploader
                file={file}
                setFile={setFile}
            /> */  //}
            
/*

            <ChangePasswordForm />

            </React.Fragment>
            ) 
            : 
            <h2 className='text-2xl'>You need to login.</h2>}

*/

