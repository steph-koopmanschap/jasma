import { useGetUserPost } from "@/features/post";
import Post from "../post";

export function UserPostList({ userID }) {
    const { status, isLoading, isError, data, error, refetch } = useGetUserPost(userID, 25);

    if (isLoading) {
        return <h1>Retrieving posts...</h1>;
    }

    if (isError) {
        return <h1>{error.message}</h1>;
    }

    return (
        <div>
            {data.success ? (
                data.posts.map((post) => (
                    <Post
                        key={post.post_id}
                        postData={post}
                    />
                ))
            ) : (
                <h1>Could not retrieve posts...</h1>
            )}
        </div>
    );
}
