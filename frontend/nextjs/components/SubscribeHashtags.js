import React from 'react';
import { useQuery } from 'react-query';
import { useState } from 'react';
import useToast from "../hooks/useToast";
import hashtagFormatter from "../utils/hashtagFormatter.js";
import api from "../clientAPI/api.js";

export default function SubscribeHashtags(props) {

    const { notifyToast } = useToast();

    //Raw input of hashtags
    const [subHashtagInput, setSubHashtagInput] = useState("");
    //Preview of formatted hashtags
    const [subbedHashtagPreview, setSubbedHashtagPreview] = useState("");
    //The hashtags that are send to the server. in the subscribeToHashtags request.
    const [hashtagsToSend, setHashtagsToSend] = useState("");
    

    //Fetch currently subscribed hashtags from server
    const { status, isLoading, isError, data, error, refetch } = useQuery([`subscribedHashtags`], 
    async () => {return await api.getSubscribedHashtags()},
    {   
        enabled: true,
        refetchOnWindowFocus: false
    }
    );

    const handleChange = (e) => {
        setSubHashtagInput(e.target.value);
        //Can only subscribe to 100 hashtags per query
        const hashtagsArray = hashtagFormatter(e.target.value, 100);
        setSubbedHashtagPreview(hashtagsArray.join(" "));
        setHashtagsToSend(hashtagsArray);
    }

    const subscribeToHashtags = async (e) => {
        e.preventDefault();
        console.log("hashtagsToSend", hashtagsToSend);
        const res = await api.subscribeToHashtags(hashtagsToSend);
        console.log("res: subscribeToHashtags", res);

        console.log(`Could not subscribe to the following hashtags: ${res.nonExistingHashtags}, because they do not exist.`);

        //Empty the input fields after subscribting to hashtags.
        setSubHashtagInput("");
        setSubbedHashtagPreview("");
        setHashtagsToSend("");

        refetch;

        notifyToast("You have been subscribed to the hashtags.");
    }

    const unsubscribeFromHashtag = async (e) => {
        const hashtag = e.target.value;
        console.log("hashtag", hashtag);
        const res = await api.unsubscribeFromHashtag(hashtag);
        console.log("res", res);
    }

    if (isLoading) {
        return (<h1>Retrieving subscribed hashtags...</h1>);
    }

    if (isError) {
        return (<h1>{error}</h1>);
    }

    if (data.success === false) {
        return (<h1>{data.message}</h1>)
    }

    return (
        <div className='flex flex-col mx-auto'>

            <form 
                id="subscribeToPostsForm" 
                action="#" 
                onSubmit={subscribeToHashtags}
            >
                <label className="block" forhtml="subsribeToHashtagsInput">Add which hashtags you want to follow. (Seperate by space)</label>
                <input
                    className="my-2 p-1 mx-2"
                    id="subsribeToHashtagsInput"
                    aria-label="Add which hashtags you want to follow."
                    type="text"
                    name="subcribeToHashtags"
                    value={subHashtagInput}
                    onChange={handleChange}
                />
                <p>Subscribing to the following hashtags:</p>
                <p className="bg-gray-800">{subbedHashtagPreview}</p>
                <input
                    className="formButtonDefault py-2 px-2 m-2 outline-white border"
                    type="submit"
                    value="Subscribe"
                />
            </form>

            <p>Your are currently subscribed to the following hashtags:</p>
            <div className='flex'>
                {data?.hashtags.map((hashtag) => (
                    <div 
                        className='flex mr-2'
                        id={`subbed_${hashtag.hashtag}`} 
                        key={`subbed_${hashtag.hashtag}`}
                    >
                        <p className='mr-2'>{hashtag.hashtag}</p>
                        <button className='text-red-400 hover:text-red-600' value={`subbed_${hashtag.hashtag}`} onClick={unsubscribeFromHashtag}>x</button>

                    </div>
                ))}
            </div>

        </div>
    );
}
