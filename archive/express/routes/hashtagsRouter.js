const express = require("express");
const isAuth = require("../middleware/isAuth.js");
const { getTopHashtagsLimiter } = require("../middleware/rateLimiters");
const { getTopHashtags, 
        getHashtagCount, 
        getSubscribedHashtags,
        subscribeToHashtags, 
        unsubscribeFromHashtag } = require("../controllers/hashtags.js");

const hashtagsRouter = express.Router();

// THIS IS PUBLIC API POINT
// api/hashtags/getTopHashtags?limit=50
hashtagsRouter.get('/getTopHashtags', getTopHashtagsLimiter, getTopHashtags);
// THIS IS PUBLIC API POINT
hashtagsRouter.get("/getHashtagCount/:hashtag", getTopHashtagsLimiter, getHashtagCount);

hashtagsRouter.get("/getSubscribedHashtags", isAuth, getSubscribedHashtags);
hashtagsRouter.post("/subscribeToHashtags", isAuth, subscribeToHashtags);
hashtagsRouter.delete("/unsubscribeFromHashtag/:hashtag", isAuth, unsubscribeFromHashtag);




module.exports = { hashtagsRouter };
