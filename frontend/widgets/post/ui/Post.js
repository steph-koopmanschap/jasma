import { PostShell } from "@/entities/post";
import { AddBookmark } from "@/features/bookmark";
import { CreateComment } from "@/features/comment";
import { DeletePostBtn, EditPostBtn, SharePostBtn, ReportPostBtn } from "@/features/post";
import CommentList from "@/widgets/comment-list";
import UserWidgets from "@/widgets/user";

export const Post = ({ postData }) => {
    if (!postData) return null;
    const { post_id } = postData;
    return (
        <PostShell
            authOwnerActions={
                <>
                    <DeletePostBtn post_id={post_id} />
                    <EditPostBtn post_id={post_id} />
                </>
            }
            authAction={<AddBookmark post_id={post_id} />}
            postData={postData}
            reportAction={<ReportPostBtn post_id={post_id} />}
            shareAction={<SharePostBtn post_id={post_id} />}
            commentList={<CommentList postID={post_id} />}
            commentAction={<CreateComment postID={post_id} />}
            profilePicture={<UserWidgets.ProfilePic userID={user_id} />}
        />
    );
};
