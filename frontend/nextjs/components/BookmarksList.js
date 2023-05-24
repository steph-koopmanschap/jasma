import { useQuery } from "react-query";
import useToast from "../hooks/useToast";
import api from "../../frontend/nextjs/clientAPI/api.js";
import Post from "./Post";

export default function BookmarksList(props) {
    const { notifyToast } = useToast();

    const { status, isLoading, isError, data, error, refetch } = useQuery(
        [`bookmarkedPosts`],
        async () => {
            return await api.getBookmarkedPosts();
        },
        {
            enabled: true,
            refetchOnWindowFocus: false
        }
    );

    const removeBookmark = async (post_id) => {
        const res = await api.removePostBookmark(post_id);
        if (res.success) {
            notifyToast("Bookmark has been removed.");
        }
    };

    if (isLoading) {
        return <h1>Retrieving bookmarked posts...</h1>;
    }

    if (isError) {
        return <h1>{error}</h1>;
    }

    if (data.success === false) {
        return <h1>{data.message}</h1>;
    }

    return (
        <div>
            {data.posts.map((post) => (
                <div key={post.post_id}>
                    <button
                        className="formButtonDefault py-2 px-2 m-2 outline-white border"
                        onClick={() => removeBookmark(post.post_id)}
                    >
                        Remove bookmark
                    </button>
                    <Post postData={post} />
                </div>
            ))}
        </div>
    );
}
