const express = require("express");
const isAuth = require("../middleware/isAuth.js");
const { createPost, getUserPosts, getLatestPosts } = require("../controllers/posts.js");
const { multipartHandler } = require("../middleware/multipartHandler");

const postsRouter = express.Router();

postsRouter.post("/createPost", isAuth, multipartHandler, createPost);
// api/posts/getUserPosts?user_id=UUID&limit=50
postsRouter.get("/getUserPosts", getUserPosts);
// api/posts/getLatestPosts?limit=50
postsRouter.get("/getLatestPosts", getLatestPosts);

module.exports = { postsRouter };
