const express = require("express");
const isAuth = require("../middleware/isAuth.js");
const { multipartHandler } = require("../middleware/multipartHandler");
const { createPost, 
        deletePost, 
        editPost, 
        getUserPosts, 
        getLatestPosts, 
        getNewsFeed,
        addPostBookmark,
        removePostBookmark,
        getBookmarkedPosts } = require("../controllers/posts.js");

const postsRouter = express.Router();

postsRouter.post("/createPost", isAuth, multipartHandler, createPost);
postsRouter.delete("/deletePost/:postID", isAuth, deletePost);
postsRouter.put("/editPost", isAuth, editPost);
// api/posts/getUserPosts?user_id=UUID&limit=50
postsRouter.get("/getUserPosts", getUserPosts);
// api/posts/getLatestPosts?limit=50
postsRouter.get("/getLatestPosts", getLatestPosts);
postsRouter.get("/getNewsFeed", isAuth, getNewsFeed);
postsRouter.post("/addPostBookmark", isAuth, addPostBookmark);
postsRouter.delete("/removePostBookmark/:post_id", isAuth, removePostBookmark);
postsRouter.get("/getBookmarkedPosts/", isAuth, getBookmarkedPosts);

module.exports = { postsRouter };
