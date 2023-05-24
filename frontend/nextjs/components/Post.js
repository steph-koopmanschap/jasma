import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatDistance } from "date-fns";
import CreateComment from "./CreateComment";
import CommentList from "./CommentList";
import ProfilePic from "./ProfilePic";
import DropDownBtn from "./DropDownBtn.js";
import Modal from "./Modal.js";
import { AddBookmark } from "@/features/bookmark/add-mark";
import SharePostBtn from "@/features/post/ui/share/SharePostBtn";
import { DeletePostBtn, EditPostBtn } from "@/features/post";
import jasmaApi from "@/clientAPI/api";
import { useToast } from "@/shared/model/hooks";

export default function Post(props) {
    const { postData } = props;

    const { notifyToast } = useToast();

    const [reportModalState, setReportModalState] = useState(false);
    const openReportModal = () => {
        setReportModalState(true);
    };
    const closeReportModal = () => {
        setReportModalState(false);
    };

    const reportPost = async (e) => {
        //prevent page from refreshing
        e.preventDefault();
        //Get reason from input field
        const report_reason = document.getElementById("reportReasonInput").value;
        console.log("report_reason", report_reason);
        const res = await jasmaApi.createReport(postData.post_id, report_reason);
        if ((res.message = "success")) {
            notifyToast("Post has been reported.");
        }
        closeReportModal();
    };

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
                        <React.Fragment>
                            <DeletePostBtn post_id={postData.post_id} />
                            <EditPostBtn post_id={postData.post_id} />
                        </React.Fragment>
                    ) : null}
                    {/* Rendered if user is logged in*/}
                    {window.localStorage.getItem("loggedInUserID") ? <AddBookmark post_id={postData.post_id} /> : null}
                    {/* Rendered if user is logged in AND is NOT owner of the post */}
                    {window.localStorage.getItem("loggedInUserID") !== postData.user_id ? (
                        <React.Fragment>
                            <button
                                className="formButtonDefault outline-white border my-1"
                                onClick={openReportModal}
                            >
                                Report
                            </button>
                            <Modal
                                modalName="reportModal"
                                isOpen={reportModalState}
                                onClose={closeReportModal}
                            >
                                <p className="text-lg font-bold">What is your reason for reporting this post?</p>
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
                    ) : null}

                    {/* Rendered if user is logged out */}
                    <DropDownBtn
                        style="flex flex-col"
                        dropDownStyle="flex flex-col p-2 m-1 bg-gray-600 border-2 border-solid border-black place-self-end"
                        addIcon={false}
                        replacementIcon={<button className="formButtonDefault outline-white border my-1">Share</button>}
                    >
                        <React.Fragment>
                            <SharePostBtn post_id={postData.post_id} />
                            <p className="text-black bg-white border-2 border-black p-2">{`${window.location.origin}/post/${postData.post_id}`}</p>
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
                {postData.created_at !== postData.last_edited_at ? (
                    <React.Fragment>
                        <p className="text-xs">Last edited on {postData.last_edited_at}</p>
                        <p className="text-xs mb-2 inline-block">
                            Last edited {formatDistance(new Date(postData.last_edited_at), new Date())} a go.
                        </p>
                    </React.Fragment>
                ) : null}

                <p className="">{postData.text_content}</p>
                <hr />

                <p className="">
                    Hashtags: &nbsp;
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

                {postData.file_url ? (
                    <Image
                        src={postData.file_url}
                        className="object-scale-down"
                        alt="Post picture"
                        width="999"
                        height="999"
                    />
                ) : null}
            </div>

            {window.localStorage.getItem("loggedInUserID") ? (
                <div className="p-2">
                    <CreateComment postID={postData.post_id} />
                </div>
            ) : null}

            <div className="p-2">
                <CommentList postID={postData.post_id} />
            </div>
        </div>
    );
}
