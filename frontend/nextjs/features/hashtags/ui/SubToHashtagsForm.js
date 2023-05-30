import { useToast } from "@/shared/model";
import React from "react";
import { handleSubToHashtags } from "../model/hashtagActions";

export const SubToHashtagsForm = () => {
    //Raw input of hashtags
    const [subHashtagInput, setSubHashtagInput] = useState("");
    //Preview of formatted hashtags
    const [subbedHashtagPreview, setSubbedHashtagPreview] = useState("");
    //The hashtags that are send to the server. in the subscribeToHashtags request.
    const [hashtagsToSend, setHashtagsToSend] = useState("");

    const { notifyToast } = useToast();

    const handleChange = (e) => {
        setSubHashtagInput(e.target.value);
        //Can only subscribe to 100 hashtags per query
        const hashtagsArray = hashtagFormatter(e.target.value, 100);
        setSubbedHashtagPreview(hashtagsArray.join(" "));
        setHashtagsToSend(hashtagsArray);
    };

    const subscribeToHashtags = async (e) => {
        e.preventDefault();
        console.log("hashtagsToSend", hashtagsToSend);
        const res = await handleSubToHashtags(hashtagsToSend);
        if (res.error) return notifyToast(res.message, true);
        console.log("res: subscribeToHashtags", res);

        console.log(
            `Could not subscribe to the following hashtags: ${res.nonExistingHashtags}, because they do not exist.`
        );

        //Empty the input fields after subscribting to hashtags.
        setSubHashtagInput("");
        setSubbedHashtagPreview("");
        setHashtagsToSend("");

        refetch;

        notifyToast("You have been subscribed to the hashtags.");
    };

    return (
        <form
            id="subscribeToPostsForm"
            action="#"
            onSubmit={subscribeToHashtags}
        >
            <label
                className="block"
                forhtml="subsribeToHashtagsInput"
            >
                Add which hashtags you want to follow. (Seperate by space)
            </label>
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
    );
};
