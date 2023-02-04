import { useRef } from 'react';
import { useQuery } from 'react-query';
import { toast } from "react-toastify";
import { toastSuccess } from "../utils/defaultToasts.js"
import api from "../clientAPI/api.js";
import Post from "./Post";

export default function BookmarksList(props) {

    //React Toast
    const toastId = useRef(null);
    const notify = (text) => (toastId.current = toastSuccess(text));
    const dismiss = () => toast.dismiss(toastId.current);

    const { status, isLoading, isError, data, error, refetch } = useQuery([`bookmarkedPosts`], 
    async () => {return await api.getBookmarkedPosts()},
    {   
        enabled: true,
        refetchOnWindowFocus: false
    }
    );

    const removeBookmark = async (post_id) => {
        const res = await api.removePostBookmark(post_id);
        if (res.success) {
            return notify("Bookmark has been removed.");
        }
    }

    if (isLoading) {
        return (<h1>Retrieving bookmarked posts...</h1>);
    }

    if (isError) {
        return (<h1>{error}</h1>);
    }

    if (data.success === false) {
        return (<h1>{data.message}</h1>)
    }

    return ( 
        <div>
            {data.posts.map((post) => (
                <div>
                    <button 
                        className='formButtonDefault py-2 px-2 m-2 outline-white border' 
                        onClick={() => removeBookmark(post.post_id)}
                    >
                        Remove bookmark
                    </button>
                    <Post
                        key={post.post_id}
                        postData={post}
                    />
                </div>
            ))}
        </div>
    );
}
