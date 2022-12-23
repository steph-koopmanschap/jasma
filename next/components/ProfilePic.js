import React from 'react';
import Image from 'next/image';
import { useQuery } from 'react-query';
import api from "../clientAPI/api.js";

export default function ProfilePic(props) {
    //Fetch profile pic from server
    const { status, isLoading, isError, data, error, refetch } = useQuery(["userProfilePic"], 
    async () => {return await api.getProfilePic(props.userid)},
    {enabled: true}
    );
    let profilePicSrc = "/";
    if (data) {
        //Create url from blob for img src={profilePic}
        profilePicSrc = window.URL.createObjectURL(data);
    }
    
    return (
        <React.Fragment>
            <Image 
                className="m-2"
                src={profilePicSrc || "/"}
                width={props.width}
                height={props.height}
                alt="Profile picture"
            />
        </React.Fragment>
    );
}
