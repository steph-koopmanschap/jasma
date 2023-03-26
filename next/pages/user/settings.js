import React, { useState, useEffect } from 'react';
import api from "../../clientAPI/api.js";
import HeaderMain from '../../components/HeaderMain';
import UploadProfilePic from '../../components/UploadProfilePic';
import ProfilePic from '../../components/ProfilePic';
import ChangePasswordForm from '../../components/ChangePasswordForm';
import FileUploader from '../../components/file-upload/FileUploader.js';


//import FileUploader from "../../file-upload/FileUploader";

//The Settings profile
export default function Settings(props) {

    const [file, setFile] = useState(null);

    const [userID, setUserID] = useState(null)
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    //Redirect user to the dashboard if they are not logged in.
    useRequireAuth('/dashboard');

    useEffect( () => {
        setUserID(window.localStorage.getItem('loggedInUserID'));
    }, []);

    const uploadProfilePic = () => {
        const res = api.uploadProfilePic(file);
        console.log("res from uploadProfilePic", res);
        setFile(null);
    }

    return (
        <div className='flex flex-col items-center'>
            <HeaderMain /> 

            <React.Fragment>
            <h1 className='text-2xl text-center'>Settings</h1>

            <UploadProfilePic userID={userID} />

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

