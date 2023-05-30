import { useGetLatestFeed, useGetNewsFeed } from "@/features/post";
import Post from "../post";

export function NewsFeed({ isGlobal = false }) {
    const { data, error, isSuccess, isError, refetch, isLoading } = isGlobal ? useGetLatestFeed() : useGetNewsFeed();

    const refresh = () => {
        refetch();
    };

    if (isLoading) {
        return <h1>Retrieving posts...</h1>;
    }
    if (isError) {
        return <h1>{error.message}</h1>;
    }

    return (
        <div>
            <button
                className="formButtonDefault py-2 px-2 m-2 outline-white border flex mx-auto"
                onClick={refresh}
            >
                Refresh
            </button>
            {data ? (
                data.posts.map((post) => (
                    <Post
                        key={post?.post_id}
                        postData={post}
                    />
                ))
            ) : (
                <p>No posts found...</p>
            )}
        </div>
    );
}
