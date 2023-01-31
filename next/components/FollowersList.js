import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import api from "../clientAPI/api.js";
import UsersList from './UsersList.js';

export default function FollowersList(props) {
    const { userID } = props;

    const { status, isLoading, isError, data, error, refetch } = useQuery([`followers_${userID}`], 
    async () => {return await api.getFollowers(userID)},
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

    if (data.success === false) {
        return (<h1>{data.message}</h1>)
    }

    return ( 
        <div>
            <p className="">Followers: {data.followerCount}</p>
            <UsersList users={data?.followers} />
            {data?.followers.map((follower) => (
                <p key={follower.user_id}>{follower.user_id}</p>
            ))}
        </div>
    );
}
