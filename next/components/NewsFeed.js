import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import api from "../clientAPI/api.js";
import Post from "./Post";

export default function NewsFeed() {

    const [posts, setPosts] = useState([]);

    const { status, isLoading, isError, data, error, refetch } = useQuery(["latestPosts"], 
    async () => {return await api.getLatestPosts(25)},
    {enabled: true}
    );
    
    // useEffect(() => { 
    //     console.log("test");
    //     console.log(data);
    //     //refetch();
    //     if (data) {
    //         console.log("hihihi");
    //         console.log(data);
    //         setPosts(data.posts);
    //     }
    // }, []);   

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
