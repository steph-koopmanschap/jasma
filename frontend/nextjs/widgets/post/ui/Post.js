import { PostShell } from "@/entities/post";
import { AddBookmark } from "@/features/bookmark/add-mark";
import { CreateComment } from "@/features/comment";
import { DeletePostBtn, EditPostBtn, SharePostBtn, ReportPostBtn } from "@/features/post";
import { CommentList } from "@/widgets/comment-list";
import { ProfilePic } from "@/widgets/user";

const Post = (props) => {
    const { postData } = props;
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
            profilePicture={<ProfilePic userID={user_id} />}
        />
    );
};

export default Post;
