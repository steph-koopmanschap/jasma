import Post from "@/components/Post";
import { useGetBookmarkedPosts } from "@/entities/bookmark";
import { RemoveBookmark } from "@/features/bookmark/remove-mark";

export default function BookmarksList(props) {
    const { status, isLoading, isError, data, error, refetch } = useGetBookmarkedPosts();

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
                    <RemoveBookmark post_id={post_id} />
                    <Post postData={post} />
                </div>
            ))}
        </div>
    );
}
