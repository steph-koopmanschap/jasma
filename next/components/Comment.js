import React, { useRef } from 'react';
import Link from "next/link";
import Image from 'next/image';
import { formatDistance } from 'date-fns';
import { toast } from "react-toastify";
import { toastSuccess } from "../utils/defaultToasts.js"
import api from "../clientAPI/api.js";
import ProfilePic from "./ProfilePic";
import DropDownBtn from './DropDownBtn.js';

export default function Comment(props) {
    const { commentData } = props;

    //React Toast
    const toastId = useRef(null);
    const notify = (text) => (toastId.current = toastSuccess(text));
    const dismiss = () => toast.dismiss(toastId.current);

    const deleteComment = async () => {
        const res = await api.deleteComment(commentData.comment_id);
        console.log(res);
        return notify("Comment deleted.");
    }

    const EditComment = () => {
        console.log("Editing comments does not work yet.")
    }

    return (
        <div className="p-2 m-2 bg-gray-800">

            <DropDownBtn 
                style="flex flex-col" 
                dropDownStyle="flex flex-col p-2 m-1 w-1/2 bg-gray-900 place-self-end">
                {(window.sessionStorage.getItem('loggedInUserID') === commentData.user_id) ? (
                    <React.Fragment>
                    <button className="formButtonDefault outline-white border my-1" onClick={deleteComment}>Delete</button>
                    <button className="formButtonDefault outline-white border my-1" onClick={EditComment}>Edit</button>
                    </React.Fragment>) 
                : null}
            </DropDownBtn>


            <ProfilePic 
                userID={commentData.user_id} 
                width={32} 
                height={32} 
            />
            <Link
                className="font-bold"
                href={`/user/${commentData.username}`}
            >
                {commentData.username}
            </Link>

            <p className="mb-2">{commentData.comment_text}</p>
            {commentData.file_url ? 
                <Image
                    src={commentData.file_url} 
                    className="object-scale-down mb-1"
                    alt="Comment picture"
                    width="999" 
                    height="999"
                />
            : null}
            
            <p className="text-xs">Created on {commentData.created_at}</p>
            <p className="text-xs">Created {formatDistance(new Date(commentData.created_at), new Date())} a go.</p>
            {(commentData.created_at !== commentData.updated_at) ? (
                <React.Fragment>
                <p className="text-xs">Last edited on {commentData.updated_at}</p>
                <p className="text-xs">Last edited {formatDistance(new Date(commentData.updated_at), new Date())} a go.</p>
                </React.Fragment>)
            : null}
        </div>
    );
}
