import { DropDownBtn } from "@/shared/ui";
import Image from "next/image";
import Link from "next/link";

/* UI wrapper where we create slots for different actions and other ui elements */

export const CommentShell = (props) => {
    const { authOwnerActions, profilePicture, commentData } = props;

    return (
        <div className="p-2 m-2 bg-gray-800">
            <DropDownBtn
                style="flex flex-col"
                dropDownStyle="flex flex-col p-2 m-1 w-1/2 bg-gray-900 place-self-end"
                addIcon={true}
                replacementIcon={null}
            >
                {window.localStorage.getItem("loggedInUserID") === commentData.user_id ? (
                    <>{authOwnerActions ? authOwnerActions : null}</>
                ) : null}
            </DropDownBtn>

            <>{profilePicture ? profilePicture : null}</>
            <Link
                className="font-bold"
                href={`/user/${commentData.username}`}
            >
                {commentData.username}
            </Link>

            <CommentContent {...commentData} />
            <CommentDateInfo {...commentData} />
            <CommentImage {...commentData} />
        </div>
    );
};

/* Private ui parts of the comment (moved it here to make CommentShell more readable) */

function CommentDateInfo({ created_at, updated_at }) {
    return (
        <>
            <p className="text-xs">Created on {created_at}</p>
            <p className="text-xs">Created {formatDistance(new Date(created_at), new Date())} a go.</p>
            {commentData.created_at !== commentData.updated_at ? (
                <>
                    <p className="text-xs">Last edited on {updated_at}</p>
                    <p className="text-xs">Last edited {formatDistance(new Date(updated_at), new Date())} a go.</p>
                </>
            ) : null}
        </>
    );
}

function CommentContent({ comment_text }) {
    return <p className="mb-2">{comment_text}</p>;
}

function CommentImage({ file_url }) {
    return (
        <>
            {file_url ? (
                <Image
                    src={file_url}
                    className="object-scale-down mb-1"
                    alt="Comment picture"
                    width="999"
                    height="999"
                />
            ) : null}
        </>
    );
}
