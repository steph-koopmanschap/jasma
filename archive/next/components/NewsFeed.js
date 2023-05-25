import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import api from "../clientAPI/api.js";
import Post from "./Post";

export default function NewsFeed() {

    const [posts, setPosts] = useState([]);

    const { status, isLoading, isError, data, error, refetch } = useQuery(["newsFeed"], 
    async () => {return await api.getNewsFeed()},
    {   
        enabled: true,
        refetchOnWindowFocus: false
    }
    );

    //console.log("HELLO FROM NEWSFEED");

    // if (data) {
    //     console.log("data from newsFeed", data);
    // }

    //Refresh newsfeed without reloading the page????
    const refresh = () => {
        refetch();
    }
    
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
            <button className='formButtonDefault py-2 px-2 m-2 outline-white border flex mx-auto' onClick={refresh}>Refresh</button>
            {data ? data.posts.map((post) => (
                <Post
                    key={post.post_id}
                    postData={post}
                />
            ))
            :
            <p>No posts found...</p>}
        </div>
    );
}
