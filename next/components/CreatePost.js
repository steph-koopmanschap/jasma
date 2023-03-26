import React, { useState } from "react";
import useToast from "../hooks/useToast";
import hashtagFormatter from "../utils/hashtagFormatter.js";
import api from "../clientAPI/api.js";
import FileUploader from "./file-upload/FileUploader.js";

const initialPostData = { text_content: "", hashtags: [], context: "post" };
export default function CreatePost() {
    
    const { notifyToast } = useToast();

    const [postData, setPostData] = useState(initialPostData);
    const [file, setFile] = useState(null);

    const [textInput, setTextInput] = useState("");
    //Raw hashtag input (will be converted to array when send to server)
    const [hashtagInput, setHashtagInput] = useState("");
    //Shows user which hashtags are included in the post
    const [hashtagPreview, setHashtagPreview] = useState("");

    const createPost = async (e) => {
        //prevent page from refreshing
        e.preventDefault();

        const createdPost = await api.createPost(postData, file);

        //Empty the input fields after creating a post.
        setTextInput("");
        setHashtagInput("");
        setHashtagPreview("");
        setFile(null);

        console.log(createdPost);
        notifyToast("Post created.");
        //return notify();
    };

    const handleChange = (e) => {
        //get the text content
        if (e.target.name === "text_content") {
            console.log(e.target.name);
            setTextInput(e.target.value);
            setPostData({
                ...postData,
                [e.target.name]: e.target.value
            });
        }
        //get the hashtags
        else if (e.target.name === "hashtags") {
            setHashtagInput(e.target.value);
            //Only 5 hashtags per post.
            const hashtagsArray = hashtagFormatter(e.target.value, 5);
            setHashtagPreview(hashtagsArray.join(" "));
            setPostData({
                ...postData,
                [e.target.name]: hashtagsArray
            });
        }
    };

    return (
        <div className="flex flex-col min-w-fit bg-gray-600 shadow-md w-1/5 mx-auto px-8 pt-6 pb-8 mb-4">
            <p className="text-xl text-center">Create post</p>
            <form
                id="createPost"
                className="flex flex-col mx-auto text-center justify-center rounded"
                action="#"
                onSubmit={createPost}
            >
                <textarea
                    className="my-2 p-1 mx-2"
                    id="newPostText"
                    aria-label="Create a post on JASMA"
                    type="textarea"
                    spellCheck="true"
                    name="text_content"
                    value={textInput}
                    onChange={handleChange}
                />

                <label forhtml="newPostHashtags">hashtags: (seperate by space)</label>
                <input
                    className="my-2 p-1 mx-2"
                    id="newPostHashtags"
                    aria-label="Set hashtags for your post"
                    type="text"
                    name="hashtags"
                    value={hashtagInput}
                    onChange={handleChange}
                />

                <p>Included hashtags (max 5):</p>
                <p className="bg-gray-800">{hashtagPreview}</p>

                <FileUploader
                    file={file}
                    setFile={setFile}
                />

                <input
                    className="formButtonDefault py-2 px-2 m-2 outline-white border"
                    type="submit"
                    value="Post"
                />
            </form>
        </div>
    );
}
