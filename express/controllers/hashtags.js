const db = require("../db/connections/jasmaAdmin");
const { PostHashtag } = db.models;

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

module.exports = {
    getTopHashtags,
    getHashtagCount
};
