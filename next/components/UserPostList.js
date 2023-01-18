import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import api from "../clientAPI/api.js";
import Post from "./Post";

export default function UserPostList(props) {
    const { userID } = props;

    const [posts, setPosts] = useState([]);

    const { status, isLoading, isError, data, error, refetch } = useQuery([`userPosts_${userID}`], 
    async () => {return await api.getUserPosts(userID, 25)},
    {enabled: true}
    );

    if (isLoading) {
        return (<h1>Retrieving posts...</h1>);
    }

    if (isError) {
        return (<h1>{error}</h1>);
    }

    return ( 
        <div>
            {data.posts.map((post) => (
                <Post
                    key={post.post_id}
                    postData={post}
                />
            ))}
        </div>
    );
}
