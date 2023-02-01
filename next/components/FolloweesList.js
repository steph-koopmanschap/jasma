import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import api from "../clientAPI/api.js";
import UsersList from './UsersList.js';

export default function FolloweesList(props) {
    const { userID } = props;

    const { status, isLoading, isError, data, error, refetch } = useQuery([`followees_${userID}`], 
    async () => { return await api.getFollowing(userID) },
    {   
        enabled: true,
        refetchOnWindowFocus: false
    }
    );

    if (isLoading) {
        return (<h1>Retrieving followees...</h1>);
    }

    if (isError) {
        return (<h1>{error}</h1>);
    }

    return ( 
        <div>
            <p className="">This person is following: {data.followingCount}</p>
            <UsersList users={data.following} />
        </div>
    );
}
