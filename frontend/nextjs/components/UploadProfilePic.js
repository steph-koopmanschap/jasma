import React from 'react';
import Image from 'next/image';
import { useQuery } from 'react-query';
import { useState } from 'react';
import api from "../clientAPI/api.js";
import ProfilePic from './ProfilePic';
import FileUploader from './file-upload/FileUploader.js';

export default function UploadProfilePic(props) {
    const { userID } = props;
    const [file, setFile] = useState(null);

    const uploadProfilePic = () => {
        const res = api.uploadProfilePic(file);
        setFile(null);
    }
    
    return (
        <div className='flex flex-col'>
            <p>Your current profile picture: </p>
            <ProfilePic 
                userID={userID}
                width="250"
                height="250"
            />
            <p>Change profile picture:</p>
            <FileUploader
                file={file}
                setFile={setFile}
            />
            {file ?  <button className="formButtonDefault outline-white border my-1" onClick={uploadProfilePic}>Upload picture.</button>
            : null}
        </div>
    );
}
