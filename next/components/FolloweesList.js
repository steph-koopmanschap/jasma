import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import api from "../clientAPI/api.js";
import UsersList from './UsersList.js';

export default function FolloweesList(props) {
    const { userID } = props;

    const { status, isLoading, isError, data, error, refetch } = useQuery([`followees_${userID}`], 
    async () => {return await api.getFollowing(userID)},
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

    if (data.success === false) {
        return (<h1>{data.message}</h1>)
    }

    return ( 
        <div>
            <p className="">Followers: {data.followingCount}</p>
            <UsersList users={data?.following} />
            {data?.followers.map((followee) => (
                <p key={followee.user_id}>{followee.user_id}</p>
            ))}
        </div>
    );
}
