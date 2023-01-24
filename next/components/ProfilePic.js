import React from 'react';
import Image from 'next/image';
import { useQuery } from 'react-query';
import api from "../clientAPI/api.js";

export default function ProfilePic(props) {

    const {userID} = props;

    //Fetch profile pic from server
    const { status, isLoading, isError, data, error, refetch } = useQuery([`profilePic_${userID}`], 
    async () => {return await api.getProfilePic(userID)},
    {   
        enabled: true,
        refetchOnWindowFocus: false
    }
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
