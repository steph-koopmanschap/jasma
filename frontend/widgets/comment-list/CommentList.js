import { useGetComments } from "@/features/comment";
import Comment from "../comment";

export const CommentList = ({ postID }) => {
    const { error, data, isLoading, isError } = useGetComments(postID, 25);

    // useEffect(() => {

    // }, [])

    if (isLoading) {
        return <h1>Retrieving comments...</h1>;
    }

    if (isError) {
        return <h1>{error.message}</h1>;
    }

    if (data.success === false) {
        return <h1>{data.message}</h1>;
    }

    return (
        <div>
            <p className="text-black">Comments: {data.commentCount}</p>
            {data.comments.map((comment) => (
                <Comment
                    key={comment.comment_id}
                    commentData={comment}
                />
            ))}
        </div>
    );
};
