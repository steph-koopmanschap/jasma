
import React, {useState} from 'react';
import hashtagFormatter from "../utils/hashtagFormatter.js";
import checkFileTooLarge from "../utils/checkFileTooLarge.js";
import api from "../clientAPI/api.js";

export default function CreatePost() {

    const [postData, setPostData] = useState({
        text: "",
        hashtags: [],
        file: null
    });

    const [textInput, setTextInput] = useState("");
    //Raw hashtag input (will be converted to array when send to server)
    const [hashtagInput, setHashtagInput] = useState("");
    //Shows user which hashtags are included in the post
    const [hashtagPreview, setHashtagPreview] = useState("");

    const [filePreview, setFilePreview] = useState();

    //Determine which html tag to insert for file preview
    //based on MIME type. E.G. Audio, Img, Video
    let _filePreviewJSX = (<React.Fragment></React.Fragment>);

    const createPost = async (e) => {
        //prevent page from refreshing
        e.preventDefault();
        //TODO: Add file
        const createdPost = await api.createPost(postData.text, postData.hashtags, "");
        
        setTextInput("");
        setHashtagInput("");
        setHashtagPreview("");
        setFilePreview(null);
        
        console.log(createdPost);
    }

    const handleChange = (e) => {
        //get the text content
        if (e.target.name === "text") 
        {
            console.log(e.target.name);
            setTextInput(e.target.value);
            setPostData({
                ...postData,
                [e.target.name]: e.target.value
            });
        }
        //get the hashtags
        else if (e.target.name === "hashtags") 
        {
            setHashtagInput(e.target.value);
            const hashtagsArray = hashtagFormatter(e.target.value);
            setHashtagPreview(hashtagsArray.join(" "));
            setPostData({
                ...postData,
                [e.target.name]: hashtagsArray
            });
        }
    }
    
    //User uploads a file
    const handleFile = (e) => {
        const file = e.target.files[0];
        if (checkFileTooLarge(file?.size) === false) {
            setPostData({
                ...postData,
                [e.target.name]: file
            });
        }
        else 
        {
            console.log("File too large!");
            //alert("File too large!");
        }

        //This sets the src for the img element from the file.
        setFilePreview(URL.createObjectURL(file));
    }

    const removeFile = () => {
        setPostData({
            ...postData,
            file: null
        });
        setFilePreview(null);
    }

    //Generates a file preview
    const filePreviewJSX = () => {
        //Check file type
        /* 
            CHANGE THIS INTO A SWITCH STATEENT?
            Switch statements have better performance of if-else statements
        */
        if (postData.file?.type.includes("image")) 
        {
            _filePreviewJSX = (   
            <img 
                id="newPostImgPreview"
                src={filePreview} 
                alt="Image preview"
                width="250" 
                height="250"
            />
            );
        } 
        else if (postData.file?.type.includes("video"))
        {
            _filePreviewJSX = (
            <video id="newPostVideoPreview" width="320" height="240" controls>
                <source src={filePreview} type={postData.file.type} />
                Your browser does not support video previews.
            </video> 
            );
        }
        else if (postData.file?.type.includes("audio"))
        {
            _filePreviewJSX = (
            <audio id="newPostAudioPreview" controls>
                <source src={filePreview} type={postData.file.type} />
                Your browser does not support audio previews.
            </audio> 
            );
        }

        if (postData.file !== null) {
            return (
                <React.Fragment>
                <button
                    className="formButtonDefault border p-2 m-2"
                    onClick={removeFile}
                >
                    Remove file
                </button> 
                {_filePreviewJSX}
                </React.Fragment>
            );
        }
    }

    return (
        <div className="flex flex-col min-w-fit bg-gray-600 shadow-md w-1/5 mx-auto px-8 pt-6 pb-8 mb-4">
            <p className="text-xl text-center">
                Create post
            </p>
            <form 
                id="createPost" 
                className="flex flex-col mx-auto text-center justify-center rounded" 
                action="#" 
                onSubmit={createPost}>

                <textarea 
                    className="my-2 p-1 mx-2"
                    id="newPostText"
                    aria-label="Create a post on JASMA"
                    type="textarea"
                    spellCheck="true"
                    name="text"
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

                <input 
                    className="mt-2"
                    type="file" 
                    id="newPostFile" 
                    name="file" 
                    accept="image/*, video/*, audio/*"
                    onInput={handleFile}
                />

                <div
                    className="m-2"
                    id="newPostFilePreviewContainer"
                >
                    {filePreviewJSX()}
                </div>
                
                <input 
                    className="formButtonDefault py-2 px-2 m-2 outline-white border"
                    type="submit"
                    value="Post" 
                />
            </form>
        </div>
    );
}
