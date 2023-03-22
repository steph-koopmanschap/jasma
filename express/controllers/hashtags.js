const db = require("../db/connections/jasmaAdmin");
const { Hashtag, PostHashtag, UserHashtagPreferences } = db.models;

//Get the most frequently used hashtags ordered from highest to lowest
async function getTopHashtags(req, res) {
    const { limit } = req.query;

    if (limit > 5000) {
        //status 400
        return res.json({ success: false, message: "Retrieving more than 5000 hashtags is not allowed." } );
    }
    const hashtags = await PostHashtag.getTopHashtags(limit);
    return res.json({ success: true, hashtags: hashtags} );
}

//Get a single hashtag with a count of how many times it appears.
async function getHashtagCount(req, res) {
    const { hashtag } = req.params;

    if (hashtag.length < 3 || hashtag.length > 50) {
        //status 400
        return res.json({ success: false, message: "Hashtags with less than 3 characters or more than 50 characters are not allowed." } );
    }
    const count = await PostHashtag.getHashtagCount(hashtag);
    return res.json({ success: true, hashtag: hashtag, count: count} );
}

//Get a list of hashtags the user has subscribed to.
async function getSubscribedHashtags(req, res) {
    const { user_id } = req.session;

    try {
        const hashtags = await UserHashtagPreferences.getSubscribedHashtags(user_id);
        return res.json({ success: true, hashtags: hashtags});
    }
    catch (err) {
        console.error(err);
        return res.json({ success: false, message: "Could not retrieve hashtags." });
    }
}

//User subscribes to hashtags so that posts with that hashtag will be viewed in the newsfeed more often.
async function subscribeToHashtags(req, res) {
    const { user_id } = req.session;
    const { hashtags } = req.body;
    console.log("hashtags", hashtags);

    const nonExistingHashtags = [];
    try {
        for (let i = 0; i < hashtags.length; i++)
        {
            //Check if the hashtag already exists.
            const HashtagAlreadyExists = await Hashtag.checkHashtagAlreadyExists(hashtags[i]);
            //We won't allow users to subscribe to hashtags that do not exist.
            if (HashtagAlreadyExists === false) {
                nonExistingHashtags.push(hashtags[i]);
            }
            else {
                const createdHashtagPreference = await UserHashtagPreferences.create({
                    hashtag: hashtags[i],
                    user_id: user_id 
                });
            }
        }
        //We also return the non existing hashtags so the client can tell the user which hashtags do not exist and can not be subscribed to.
        return res.json({ success: true, nonExistingHashtags: nonExistingHashtags });
    }
    catch (err) {
        console.error(err);
        return res.json({ success: false, message: "Could not subscribe to hashtags." });
    }
}

//User unsubscribes from hashtag so that posts with that hashtag will no longer be viewed in the newsfeed.
async function unsubscribeFromHashtag(req, res) {
    const { user_id } = req.session;
    const { hashtag } = req.params;

    try {
        const deletedHashtagPreference = await UserHashtagPreferences.destroy({
            where : {
                hashtag: hashtag,
                user_id: user_id 
            }
        });

        return res.json({ success: true });
    }
    catch (err) {
        console.error(err);
        return res.json({ success: false, message: "Could not unsubscribe from hashtags." });
    }
}

module.exports = {
    getTopHashtags,
    getHashtagCount,
    getSubscribedHashtags,
    subscribeToHashtags,
    unsubscribeFromHashtag
};
