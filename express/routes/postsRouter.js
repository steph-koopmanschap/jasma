const express = require("express");
const { newsFeedLimiter, postsAndCommentsLimiter } = require("../middleware/rateLimiters");
const isAuth = require("../middleware/isAuth.js");
const { multipartHandler } = require("../middleware/multipartHandler");
const { createPost, 
        deletePost, 
        editPost, 
        getUserPosts,
        getSinglePost, 
        getMultiplePosts,
        getLatestPosts, 
        getNewsFeed,
        addPostBookmark,
        removePostBookmark,
        getBookmarkedPosts } = require("../controllers/posts.js");

const postsRouter = express.Router();

postsRouter.post("/createPost", postsAndCommentsLimiter, isAuth, multipartHandler, createPost);
postsRouter.delete("/deletePost/:postID", postsAndCommentsLimiter, isAuth, deletePost);
postsRouter.put("/editPost", postsAndCommentsLimiter, isAuth, editPost);
// api/posts/getUserPosts?user_id=UUID&limit=50
postsRouter.get("/getUserPosts", newsFeedLimiter, getUserPosts);
postsRouter.get("/getSinglePost/:post_id", getSinglePost);
postsRouter.post("/getMultiplePosts", getMultiplePosts);
// api/posts/getLatestPosts?limit=50
postsRouter.get("/getLatestPosts", newsFeedLimiter, getLatestPosts);
postsRouter.get("/getNewsFeed", newsFeedLimiter, isAuth, getNewsFeed);
postsRouter.post("/addPostBookmark", isAuth, addPostBookmark);
postsRouter.delete("/removePostBookmark/:post_id", isAuth, removePostBookmark);
postsRouter.get("/getBookmarkedPosts", isAuth, getBookmarkedPosts);

module.exports = { postsRouter };
