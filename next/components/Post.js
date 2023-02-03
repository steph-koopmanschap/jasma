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

    const editPost = () => {
        console.log("Editing posts does not work yet.");
    }

    const reportPost = () => {
        console.log("Reporting posts does not work yet.");
    }

    const bookmarkPost = () => {
        console.log("Bookmarking posts does not work yet.");
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
                        <button className="formButtonDefault outline-white border my-1" onClick={bookmarkPost}>Bookmark</button>
                        </React.Fragment>) 
                    : null}
                    <button className="formButtonDefault outline-white border my-1" onClick={reportPost}>Report</button>
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
                <p className="">Hashtags: {postData.hashtags}</p>
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
