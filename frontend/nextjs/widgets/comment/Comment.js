import { CommentShell } from "@/entities/comment";
import { DeleteCommentButton, EditCommentButton } from "@/features/comment";
import UserWidgets from "../user";
export const Comment = (props) => {
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
            profilePicture={<UserWidgets.ProfilePic userID={commentData.user_id} />}
        />
    );
};
