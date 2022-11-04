
import React, {useState} from 'react';
import {checkFileTooLarge} from "../utilities/utilities.js";

export default function CreatePost() {

    const [postData, setPostData] = useState({
        text: "",
        hashtags: [],
        file: null
    });

    const [filePreview, setFilePreview] = useState();

    //Determine which html tag to insert for file preview
    //based on MIME type. E.G. Audio, Img, Video
    let _filePreviewJSX = (<React.Fragment></React.Fragment>);

    const createPost = (e) => {
        //prevent page from refreshing
        e.preventDefault();
        console.log(postData);
    }

    const handleChange = (e) => {
        setPostData({
            ...postData,
            [e.target.name]: e.target.value
        });
    }
    
    //User uploads a file
    const handleFile = (e) => {
        const file = e.target.files[0];
        if (checkFileTooLarge(file.size) === false) {
            setPostData({
                ...postData,
                [e.target.name]: file
            });
        }
        else {
            alert("File too large!");
        }
        

        if (postData.file !== null) {
            setFilePreview(URL.createObjectURL(postData.file));
            filePreviewJSX();
        }
        console.log(postData);
        console.log(filePreview);
    }

    const removeFile = () => {
        setPostData({
            ...postData,
            file: null
        });
    }

    //Generates a file preview
    const filePreviewJSX = () => {
        //Check file type
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
                    className="border-2 p-2 m-2"
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
                    type="textarea"
                    name="text"
                    value={postData.text}
                    onChange={handleChange} 
                />

                <label forhtml="newPostHashtags">hashtags:</label>
                <input 
                    className="my-2 p-1 mx-2"
                    id="newPostHashtags"
                    type="text"
                    name="hashtags"
                    value={postData.hashtags}
                    onChange={handleChange} 
                />

                <input 
                    type="file" 
                    id="newPostFile" 
                    name="file" 
                    accept="image/*, video/*, audio/*"
                    onChange={handleFile}
                />

                <div
                    className="m-2"
                    id="newPostFilePreviewContainer"
                >
                    {filePreviewJSX()}
                </div>
                
                <input 
                    className="text-white font-bold py-2 px-2 m-2 rounded outline-white border focus:outline-white"
                    type="submit"
                    value="Post" 
                />
            </form>
        </div>
    );
}
