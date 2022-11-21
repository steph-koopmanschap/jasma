import React, { useState, useEffect } from 'react';
import Post from "./Post";

export default function NewsFeed() {
    const [posts, setPosts] = useState([]);

    //Load posts here?
    useEffect(() => {
        
    }, [])

    return ( 
        <div>
            {/* {posts.map((post) => (
                <Post
                    postData={post.postData}
                />
            ))} */}
        </div>
    );
}
