import { CommentShell } from "@/entities/comment";
import { DeleteCommentButton, EditCommentButton } from "@/features/comment";
import { ProfilePic } from "../user";

const Comment = (props) => {
    const { commentData } = props;

    return (
        <CommentShell
            authOwnerActions={
                <>
                    <EditCommentButton comment_id={commentData.comment_id} />
                    <DeleteCommentButton comment_id={commentData.comment_id} />
                </>
            }
            commentData={commentData}
            profilePicture={<ProfilePic userID={commentData.user_id} />}
        />
    );
};
export default Comment;
