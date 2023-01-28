import { useRouter } from 'next/router';
import api from "../../clientAPI/api.js";
import HeaderMain from '../../components/HeaderMain';
import ProfilePic from '../../components/ProfilePic';

import React, { useState, useEffect } from 'react';

//import FileUploader from "../../file-upload/FileUploader";

//The Settings profile
export default function Settings(props) {
    const router = useRouter();

    const [file, setFile] = useState(null);

    const [userID, setUserID] = useState(null)
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [passwordChangeState, setPasswordChangeState] = useState({
        newPasswordInput: "",
        secondPasswordInput: ""
    });

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

    const handleChangePassword = (e) => {
        const value = e.target.value;
        setPasswordChangeState({
            ...passwordChangeState,
            [e.target.name]: value
        });
    };

    const changePassword = async (e) => {
        e.preventDefault();
        if (passwordChangeState.newPasswordInput === passwordChangeState.secondPasswordInput)
        {
            const res = await api.changePassword(passwordChangeState.newPasswordInput);
            console.log(res);
        }
        else {
            console.log("Passwords do not match");
        }
    };

    return (
        <div>
            <HeaderMain /> 

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
            /> */}

            <div className="flex flex-col items-center justify-center my-14">
                <p className='my-2'>Change your password:</p>
                <form className='bg-gray-600 shadow-md rounded px-8 pt-6 pb-8 mb-4' action="#" onSubmit={changePassword}>
                    <div className="mb-2">
                        <label className='labelDefault' htmlFor="newPasswordInput">New password</label>
                        <input 
                            type="password"
                            id="newPasswordInput"
                            placeholder="New password"
                            name="newPasswordInput"
                            value={passwordChangeState.newPasswordInput}
                            onChange={handleChangePassword}
                            required 
                            minLength="3"
                            maxLength="16"
                        /> 
                    </div>
                    <div className="mb-2">
                        <label className='labelDefault' htmlFor="newPasswordInput">Retype password</label>
                        <input 
                            type="password"
                            id="secondPasswordInput"
                            placeholder="Retype password"
                            name="secondPasswordInput"
                            value={passwordChangeState.secondPasswordInput}
                            onChange={handleChangePassword}
                            required 
                            minLength="3"
                            maxLength="16"
                        /> 
                    </div>
                    <div className="flex flex-col items-center justify-between">
                        <input className="formButtonDefault"
                            type="submit" 
                            value="Change password" 
                        /> 
                    </div>
                </form>
            </div>

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

            <p>Change your password:</p>
            <form action="#" onSubmit={changePassword}>
                <label className='labelDefault' htmlFor="newPasswordInput">New password</label>
                <input 
                    type="password"
                    id="newPasswordInput"
                    placeholder="New password"
                    name="newPasswordInput"
                    value={passwordChangeState.newPasswordInput}
                    onChange={handleChangePassword}
                    required 
                    minLength="3"
                    maxLength="16"
                /> 
                <label className='labelDefault' htmlFor="newPasswordInput">Retype password</label>
                <input 
                    type="password"
                    id="secondPasswordInput"
                    placeholder="New password"
                    name="secondPasswordInput"
                    value={passwordChangeState.secondPasswordInput}
                    onChange={handleChangePassword}
                    required 
                    minLength="3"
                    maxLength="16"
                /> 
            </form>

            </React.Fragment>
            ) 
            : 
            <h2 className='text-2xl'>You need to login.</h2>}

*/

