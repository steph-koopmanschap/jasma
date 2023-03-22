import React, { useRef, useState } from 'react';
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
import Modal from './Modal.js';

export default function Post(props) {
    const { postData } = props;

    //React Toast
    const toastId = useRef(null);
    const notify = (text) => (toastId.current = toastSuccess(text));
    const dismiss = () => toast.dismiss(toastId.current);

    const [reportModalState, setReportModalState] = useState(false);
    const openReportModal = () => {
        setReportModalState(true);
    }
    const closeReportModal = () => {
        setReportModalState(false);
    }

    const deletePost = async () => {
        const res = await api.deletePost(postData.post_id);
        return notify("Post deleted.");
    }

    const editPost = async () => {
        console.log("Editing posts does not work yet.");
    }

    const reportPost = async (e) => {
        //prevent page from refreshing
        e.preventDefault();
        //Get reason from input field
        const report_reason = document.getElementById("reportReasonInput").value;
        console.log("report_reason", report_reason);
        const res = await api.createReport(postData.post_id, report_reason);
        if (res.message = "success") {
            return notify("Post has been reported.");
        }
        closeReportModal();
    }

    const bookmarkPost = async () => {
        const res = await api.addPostBookmark(postData.post_id);
        if (res.message = "success") {
            return notify("Post has been bookmarked.");
        }
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
                
                {/* Post menu */}
                <DropDownBtn 
                    style="flex flex-col" 
                    dropDownStyle="flex flex-col p-2 m-1 w-1/2 bg-gray-900 place-self-end"
                    addIcon={true}
                    replacementIcon={null}
                >
                    {/* Rendered if user is logged in AND is owner of the post */}
                    {(window.localStorage.getItem('loggedInUserID') === postData.user_id) ? (
                        <React.Fragment>
                        <button className="formButtonDefault outline-white border my-1" onClick={deletePost}>Delete</button>
                        <button className="formButtonDefault outline-white border my-1" onClick={editPost}>Edit</button>
                        </React.Fragment>) 
                    : null}
                    {/* Rendered if user is logged in*/}
                    {window.localStorage.getItem('loggedInUserID') ? 
                        <button className="formButtonDefault outline-white border my-1" onClick={bookmarkPost}>Bookmark</button>
                    : null}
                    {/* Rendered if user is logged in AND is NOT owner of the post */}
                    {(window.localStorage.getItem('loggedInUserID') !== postData.user_id) ?
                        <React.Fragment>
                        <button className="formButtonDefault outline-white border my-1" onClick={openReportModal}>Report</button>
                        <Modal modalName="reportModal" isOpen={reportModalState} onClose={closeReportModal} >
                            <p className='text-lg font-bold'>What is your reason for reporting this post?</p>
                            <form
                                id="createReportForm"
                                action="#"
                                onSubmit={reportPost}
                            >
                                <textarea
                                    className="my-2 p-1 mx-2"
                                    id="reportReasonInput"
                                    aria-label="Submit a report on a post."
                                    type="textarea"
                                    spellCheck="true"
                                    name="report_reason_input"
                                />
                                <input
                                    className="formButtonDefault outline-white border my-1"
                                    type="submit"
                                    value="Submit report"
                                />
                            </form>
                        </Modal>
                        </React.Fragment>
                    : null}

                    {/* Rendered if user is logged out */}
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
                </DropDownBtn>
                {/* Post menu -END */}

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
