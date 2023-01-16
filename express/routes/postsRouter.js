const express = require("express");
const { getLatestPosts } = require("../controllers/posts.js")

const postsRouter = express.Router();

// api/posts/getLatestPosts?limit=50
postsRouter.get('/getLatestPosts', getLatestPosts);

module.exports = { postsRouter };