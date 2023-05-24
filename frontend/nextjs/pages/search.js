import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import api from "../clientAPI/api.js";
import HeaderMain from '../components/HeaderMain';
import Post from "../components/Post";
import Comment from "../components/Comment";
import UsersList from "../components/UsersList";

//The search results page
export default function Search() {
    const router = useRouter();
    const { q } = router.query;

    const [filter, setFilter] = useState("posts");

    const { status, isLoading, isError, data, error, refetch } = useQuery([`search_key=${q}&filter=${filter}`], 
    async () => {return await api.search(q, filter)},
    {   
        enabled: true,
        refetchOnWindowFocus: false
    }
    );

    const renderResult = () => {
        if (isLoading) {
            return (<h1>Searching...</h1>);
        }
    
        if (isError) {
            return (<h1>{error}</h1>);
        }

        if (filter === "hashtags" || filter === "posts")
        {
            return (
                <div>
                {data.result.map((post) => (
                    <Post
                        key={post.post_id}
                        postData={post}
                    />
                ))}
                </div>
                );
        }
        else if (filter === "comments")
        {
            return (
                <div>
                {data.result.map((comment) => (
                    <Comment
                        key={comment.comment_id}
                        commentData={comment}
                    />
                ))}
                </div>
                );
        }
        else if (filter === "users")
        {
            return (
                <UsersList users={data.result} />
            );
        }
    }

    const changeFilter = (e) => {
        setFilter(e.target.value);
        refetch();
    }

    return (
        <div>
            <HeaderMain/>
            <h3 className='flex justify-center mx-auto text-xl'>Filters:</h3>
            <div className='flex justify-center mx-auto'>
                    <button className='formButtonDefault m-2' value="hashtags" onClick={changeFilter}>Hashtags</button>
                    <button className='formButtonDefault m-2' value="posts" onClick={changeFilter}>Text in posts</button>
                    <button className='formButtonDefault m-2' value="comments" onClick={changeFilter}>Comments</button>
                    <button className='formButtonDefault m-2' value="users" onClick={changeFilter}>Users</button>
                    <button className='formButtonDefault m-2' value="bookmarks" onClick={changeFilter}>Bookmarks</button>
                {/* <h3 className='text-xl'>Sub Filters:</h3>
                    <button className='formButtonDefault m-2'>Videos</button>
                    <button className='formButtonDefault m-2'>Images</button>
                    <button className='formButtonDefault m-2'>Audios</button>
                    <button className='formButtonDefault m-2'>Text</button> */}
            </div>
            <div className='flex flex-col justify-center mx-auto'>
                <h1 className='text-center'>Results: </h1>

                <div>
                    {data?.success ? renderResult() : (<h1>{data?.message}</h1>)}
                </div>
            </div>
        </div>
    );
}
