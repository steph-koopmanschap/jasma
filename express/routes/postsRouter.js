const express = require("express");
const { createPost, getUserPosts, getLatestPosts } = require("../controllers/posts.js")

const postsRouter = express.Router();


postsRouter.post('/createPost', createPost);
// api/posts/getUserPosts?user_id=UUID&limit=50
postsRouter.get('/getUserPosts', getUserPosts);
// api/posts/getLatestPosts?limit=50
postsRouter.get('/getLatestPosts', getLatestPosts);

module.exports = { postsRouter };