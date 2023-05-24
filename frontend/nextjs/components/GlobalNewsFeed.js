import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import Post from "./Post";
import jasmaApi from "@/clientAPI/api";

export default function NewsFeed() {
    const [posts, setPosts] = useState([]);

    const { status, isLoading, isError, data, error, refetch } = useQuery(
        ["newsFeed"],
        async () => {
            return await jasmaApi.getLatestPosts(25);
        },
        {
            enabled: true,
            refetchOnWindowFocus: false
        }
    );

    //Refresh newsfeed without reloading the page????
    const refresh = () => {
        refetch();
    };

    if (isLoading) {
        return <h1>Retrieving posts...</h1>;
    }

    if (isError) {
        return <h1>{error}</h1>;
    }

    return (
        <div>
            <button
                className="formButtonDefault py-2 px-2 m-2 outline-white border flex mx-auto"
                onClick={refresh}
            >
                Refresh
            </button>
            {data.posts.map((post) => (
                <Post
                    key={post.post_id}
                    postData={post}
                />
            ))}
        </div>
    );
}
