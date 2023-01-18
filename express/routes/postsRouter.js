const express = require("express");
const { getUserPosts, getLatestPosts } = require("../controllers/posts.js")

const postsRouter = express.Router();

// api/posts/getUserPosts?user_id=UUID&limit=50
postsRouter.get('/getUserPosts', getUserPosts);
// api/posts/getLatestPosts?limit=50
postsRouter.get('/getLatestPosts', getLatestPosts);

module.exports = { postsRouter };