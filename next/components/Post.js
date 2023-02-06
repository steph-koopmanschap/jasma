import React, { useRef } from 'react';
import Link from "next/link";
import Image from 'next/image';
import { formatDistance } from "date-fns";
import { toast } from "react-toastify";
import { toastSuccess } from "../utils/defaultToasts.js"
import api from "../clientAPI/api.js";
import CreateComment from "./CreateComment";
import CommentList from "./CommentList";
import ProfilePic from "./ProfilePic";
import DropDownBtn from './DropDownBtn.js';

export default function Post(props) {
    const { postData } = props;

    //React Toast
    const toastId = useRef(null);
    const notify = (text) => (toastId.current = toastSuccess(text));
    const dismiss = () => toast.dismiss(toastId.current);

    const deletePost = async () => {
        const res = await api.deletePost(postData.post_id);
        console.log(res);
        return notify("Post deleted.");
    }

    const editPost = async () => {
        console.log("Editing posts does not work yet.");
    }

    const reportPost = async () => {
        console.log("Reporting posts does not work yet.");
    }

    const bookmarkPost = async () => {
        const res = await api.addPostBookmark(postData.post_id);
        return notify("Post has been bookmarked.");
    }

    const sharePost = async () => {
        navigator.clipboard.writeText(`${window.location.origin}/post/${postData.post_id}`).then(
            () => {
                return notify("Link has been copied to your clipboard.");
            },
            () => {
              /* clipboard write failed */
            }
        );
    }

    return (
        <div className="mx-auto w-1/5 bg-gray-400 p-2 m-4">
            <div className="p-2 m-2 bg-gray-600">
                
                <DropDownBtn 
                    style="flex flex-col" 
                    dropDownStyle="flex flex-col p-2 m-1 w-1/2 bg-gray-900 place-self-end"
                    addIcon={true}
                    replacementIcon={null}
                >
                    {(window.localStorage.getItem('loggedInUserID') === postData.user_id) ? (
                        <React.Fragment>
                        <button className="formButtonDefault outline-white border my-1" onClick={deletePost}>Delete</button>
                        <button className="formButtonDefault outline-white border my-1" onClick={editPost}>Edit</button>
                        </React.Fragment>) 
                    : null}
                    {window.localStorage.getItem('loggedInUserID') ? 
                        <button className="formButtonDefault outline-white border my-1" onClick={bookmarkPost}>Bookmark</button>
                    : null}
                    {(window.localStorage.getItem('loggedInUserID') !== postData.user_id) ? (
                        <React.Fragment>
                        <button className="formButtonDefault outline-white border my-1" onClick={reportPost}>Report</button>

                        <DropDownBtn 
                            style="flex flex-col" 
                            dropDownStyle="flex flex-col p-2 m-1 bg-gray-600 border-2 border-solid border-black place-self-end"
                            addIcon={false}
                            replacementIcon={(<button className="formButtonDefault outline-white border my-1">Share</button>)}
                        >
                            <React.Fragment>
                            <p className="formButtonDefault outline-black border my-1" onClick={sharePost}>Copy link</p>
                            <p className='text-black bg-white border-2 border-black p-2'>{`${window.location.origin}/post/${postData.post_id}`}</p>
                            </React.Fragment>
                        </DropDownBtn>

                        </React.Fragment>)
                    : null}
                </DropDownBtn>

                <ProfilePic
                    userID={postData.user_id}
                    width={32}
                    height={32}
                />
                <Link
                    className="font-bold"
                    href={`/user/${postData.username}`}
                >
                    {postData.username}
                </Link>
                <p className="text-xs">Created on {postData.created_at}</p>
                <p className="text-xs mb-2 inline-block">
                    Created {formatDistance(new Date(postData.created_at), new Date())} a go.
                </p>
                {(postData.created_at !== postData.last_edited_at) ? (
                    <React.Fragment>
                    <p className="text-xs">Last edited on {postData.last_edited_at}</p>
                    <p className="text-xs mb-2 inline-block">Last edited {formatDistance(new Date(postData.last_edited_at), new Date())} a go.</p>
                    </React.Fragment>)
                : null}
                
                <p className="">{postData.text_content}</p>
                <hr />
                
                <p className="">Hashtags: &nbsp;
                {postData.hashtags.map((hashtag) => (
                    <Link
                        className="font-bold text-sky-500 mr-1 before:content-['#']"
                        key={`${postData.post_id}_${hashtag}`}
                        href={`/search?q=${hashtag}`}
                    >
                        {hashtag}
                    </Link>
                ))}
                </p>

                {postData.file_url ? 
                    <Image
                        src={postData.file_url}
                        className="object-scale-down"
                        alt="Post picture"
                        width="999"
                        height="999"
                    /> 
                : null}
            </div>

            {window.localStorage.getItem('loggedInUserID') ? (            
                <div className="p-2">
                    <CreateComment postID={postData.post_id} />
                </div>) 
            : null}

            <div className="p-2">
                <CommentList postID={postData.post_id} />
            </div>
        </div>
    );
}
