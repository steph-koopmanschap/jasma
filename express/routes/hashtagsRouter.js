const express = require("express");
const { getTopHashtagsLimiter } = require("../middleware/rateLimiters");
const { getTopHashtags, getHashtagCount } = require("../controllers/hashtags.js");

const hashtagsRouter = express.Router();

// THIS IS PUBLIC API POINT
// api/hashtags/getTopHashtags?limit=50
hashtagsRouter.get('/getTopHashtags', getTopHashtagsLimiter, getTopHashtags);
// THIS IS PUBLIC API POINT
hashtagsRouter.get("/getHashtagCount/:hashtag", getTopHashtagsLimiter, getHashtagCount);

module.exports = { hashtagsRouter };
