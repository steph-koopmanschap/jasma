import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import api from "../clientAPI/api.js";
import UsersList from './UsersList.js';

export default function FollowersList(props) {
    const { userID } = props;

    const { status, isLoading, isError, data, error, refetch } = useQuery([`followers_${userID}`], 
    async () => { return await api.getFollowers(userID) },
    {   
        enabled: true,
        refetchOnWindowFocus: false
    }
    );

    if (isLoading) {
        return (<h1>Retrieving followers...</h1>);
    }

    if (isError) {
        return (<h1>{error}</h1>);
    }

    return ( 
        <div>
            <p className="">People that follow this person: {data.followersCount}</p>
            <UsersList users={data.followers} />
        </div>
    );
}
