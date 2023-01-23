import React, { useState } from 'react';
import api from "../clientAPI/api.js";

export default function CreateComment(props) {

    const { postID } = props;

    const [commentData, setCommentData] = useState({
        comment_text: "",
        file: null
    });

    const [response, setResponse] = useState();

    const [textInput, setTextInput] = useState("");
    const [filePreview, setFilePreview] = useState(null);

    const createComment = async (e) => {
        //prevent page from refreshing
        e.preventDefault();

        //TODO: Send file too.
        const createdComment = await api.createComment(postID, commentData.comment_text, "");
        console.log(createdComment);
    }

    const handleChange = (e) => {
        //get the text content
        if (e.target.name === "comment_text") 
        {
            setTextInput(e.target.value);
            setCommentData({
                ...commentData,
                [e.target.name]: e.target.value
            });
        }
    }

    return (
        <div className="flex flex-col min-w-fit bg-gray-600 shadow-md w-1/5 mx-auto px-1 pt-1 pb-1 mb-1">
            <form 
                id="createComment" 
                className="flex flex-col mx-auto text-center justify-center rounded" 
                action="#" 
                onSubmit={createComment}>

                <textarea 
                    className="my-1 p-1 mx-1"
                    id="newPostText"
                    aria-label="Add a comment on a post"
                    type="textarea"
                    spellCheck="true"
                    placeholder="Add comment..."
                    name="comment_text"
                    value={textInput}
                    onChange={handleChange} 
                />

                <input 
                    className="formButtonDefault py-1 px-1 m-1 outline-white border "
                    type="submit"
                    value="Submit comment" 
                />

                {(response?.status) ? null : (<p>{response?.message}</p>)}
            </form>
        </div>
    );
}
