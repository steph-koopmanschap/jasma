/* UI wrapper where we create slots for different actions and other ui elements */

import { DropDownBtn } from "@/shared/ui";
import Image from "next/image";
import Link from "next/link";

export const PostShell = (props) => {
    const {
        authOwnerActions,
        authAction,
        postData,
        reportAction,
        shareAction,
        commentList,
        commentAction,
        profilePicture
    } = props;

    return (
        <div className="mx-auto w-1/5 bg-gray-400 p-2 m-4">
            <div className="p-2 m-2 bg-gray-600">
                {/* Post menu */}
                <DropDownBtn
                    style="flex flex-col"
                    dropDownStyle="flex flex-col p-2 m-1 w-1/2 bg-gray-900 place-self-end"
                    addIcon={true}
                    replacementIcon={null}
                >
                    {/* Rendered if user is logged in AND is owner of the post */}
                    {window.localStorage.getItem("loggedInUserID") === postData.user_id ? (
                        <>{authOwnerActions ? authOwnerActions : null}</>
                    ) : null}
                    {/* Rendered if user is logged in*/}
                    {window.localStorage.getItem("loggedInUserID") ? <>{authAction ? authAction : null}</> : null}
                    {/* Rendered if user is logged in AND is NOT owner of the post */}
                    {window.localStorage.getItem("loggedInUserID") !== postData.user_id ? (
                        <>{reportAction ? reportAction : null}</>
                    ) : null}

                    {/* Rendered if user is logged out */}
                    <DropDownBtn
                        style="flex flex-col"
                        dropDownStyle="flex flex-col p-2 m-1 bg-gray-600 border-2 border-solid border-black place-self-end"
                        addIcon={false}
                        replacementIcon={<button className="formButtonDefault outline-white border my-1">Share</button>}
                    >
                        <>{shareAction ? shareAction : null}</>
                    </DropDownBtn>
                </DropDownBtn>
                {/* Post menu -END */}
                <>{profilePicture ? profilePicture : null}</>
                <Link
                    className="font-bold"
                    href={`/user/${postData.username}`}
                >
                    {postData.username}
                </Link>
                <PostDateInfo {...postData} />
                <PostTextContent {...postData} />
                <hr />
                <PostHashTags {...postData} />
                <PostPicture {...postData} />
            </div>

            {window.localStorage.getItem("loggedInUserID") ? (
                <div className="p-2">{commentAction ? commentAction : null}</div>
            ) : null}

            <div className="p-2">{commentList ? commentList : null}</div>
        </div>
    );
};

/* Private ui parts of the post (moved it here to make PostShell more readable) */

function PostDateInfo({ last_edited_at, created_at }) {
    return (
        <>
            <p className="text-xs">Created on {created_at}</p>
            <p className="text-xs mb-2 inline-block">
                Created {formatDistance(new Date(created_at), new Date())} a go.
            </p>
            {created_at !== last_edited_at ? (
                <>
                    <p className="text-xs">Last edited on {last_edited_at}</p>
                    <p className="text-xs mb-2 inline-block">
                        Last edited {formatDistance(new Date(last_edited_at), new Date())} a go.
                    </p>
                </>
            ) : null}
        </>
    );
}

function PostTextContent({ text_content }) {
    return <p className="">{text_content}</p>;
}

function PostHashTags({ hashtags }) {
    return (
        <p className="">
            Hashtags: &nbsp;
            {hashtags.map((hashtag) => (
                <Link
                    className="font-bold text-sky-500 mr-1 before:content-['#']"
                    key={`${postData.post_id}_${hashtag}`}
                    href={`/search?q=${hashtag}`}
                >
                    {hashtag}
                </Link>
            ))}
        </p>
    );
}

function PostPicture({ file_url }) {
    return (
        <>
            {file_url ? (
                <Image
                    src={postData.file_url}
                    className="object-scale-down"
                    alt="Post picture"
                    width="999"
                    height="999"
                />
            ) : null}
        </>
    );
}
