import { useGetSinglePost } from "@/features/post/index.js";
import { Post } from "@/widgets/post/index.js";
import { useRouter } from "next/router";

//Shows a specific single post on a page
export default function PostPage() {
    const router = useRouter();
    const { postID } = router.query;

    const { status, isLoading, isError, data, error, refetch } = useGetSinglePost(postID);

    if (isLoading) {
        return <h1>Retrieving post...</h1>;
    }

    if (!data || data?.success === false) {
        return <h1>Post not found.</h1>;
    }

    if (isError) {
        return <h1>{error}</h1>;
    }

    return (
        <div>
            <Post postData={data.posts[0]} />
        </div>
    );
}
