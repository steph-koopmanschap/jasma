import React, { useState } from 'react';

export default function CreateComment() {
    const [commentData, setCommentData] = useState({
        comment_text: "",
        file: null
    });

    const [textInput, setTextInput] = useState("");
    const [filePreview, setFilePreview] = useState();

    const createComment = (e) => {
        //prevent page from refreshing
        e.preventDefault();

        console.log(commentData);
    }

    const handleChange = (e) => {
        //get the text content
        if (e.target.name === "text") 
        {
            console.log(e.target.name);
            setTextInput(e.target.value);
            setCommentData({
                ...commentData,
                [e.target.name]: e.target.value
            });
        }
    }

    return (
        <div className="flex flex-col min-w-fit bg-gray-600 shadow-md w-1/5 mx-auto px-8 pt-6 pb-8 mb-4">
            <p className="text-xl text-center">
                Add comment
            </p>
            <form 
                id="createComment" 
                className="flex flex-col mx-auto text-center justify-center rounded" 
                action="#" 
                onSubmit={createComment}>

                <textarea 
                    className="my-2 p-1 mx-2"
                    id="newPostText"
                    aria-label="Add a comment on a post"
                    type="textarea"
                    spellCheck="true"
                    name="text"
                    value={textInput}
                    onChange={handleChange} 
                />

                <input 
                    className="formButtonDefault py-2 px-2 m-2 outline-white border "
                    type="submit"
                    value="Submit comment" 
                />
            </form>
        </div>
    );
}
