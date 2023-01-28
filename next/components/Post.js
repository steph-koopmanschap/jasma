import React from 'react';
import Link from "next/link";
import Image from 'next/image';
import { formatDistance } from "date-fns";
import api from "../clientAPI/api.js";
import CreateComment from "./CreateComment";
import CommentList from "./CommentList";
import ProfilePic from "./ProfilePic";

export default function Post(props) {
    const { postData } = props;

    const deletePost = async () => {
        const res = await api.deletePost(postData.post_id);
        console.log(res);
    }

    const EditPost = () => {
        console.log("Editing posts does not work yet.")
    }

    return (
        <div className="mx-auto w-1/5 bg-gray-400 p-2 m-4">
            <div className="p-2 m-2 bg-gray-600">
                {(window.sessionStorage.getItem('loggedInUserID') === postData.user_id) ? (
                    <React.Fragment>
                    <button className="formButtonDefault outline-white border mr-1" onClick={deletePost}>Delete</button>
                    <button className="formButtonDefault outline-white border" onClick={EditPost}>Edit</button>
                    </React.Fragment>) 
                : null}

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
                <p className="text-xs">{postData.created_at}</p>
                <p className="text-xs mb-2 inline-block">
                    {formatDistance(new Date(postData.created_at), new Date())} a go.
                </p>
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

            {window.sessionStorage.getItem('loggedInUserID') ? (            
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
