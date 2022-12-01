const express = require("express");
const getComments = require("./../controllers/comment/getComments.js");
const createComment = require("./../controllers/comment/createComment.js");
const deleteComment = require("./../controllers/comment/deleteComment.js");

// Create the post router
// The base URL for this router is URL:PORT/api/post/
const commentRouter = express.Router();

//Retrieve a number of commments from a post
//Example url
// /getcomments:userid?limit=10
commentRouter.get("/getcomments/:postid", async (req, res) => {
    const { post_id } = req.params;
    const { limit } = req.query;
    const comments = await getCommentsDB(post_id, limit);
    try {
        let result = await getComments(req.params.postid, req.query.limit);
        if (result instanceof Error || result === null) {
            return res.status(404).send(result);
        }
        return res.status(200).send(result);
    } catch (error) {
        console.log("500: Internal server error - " + error.message);
        res.status(500).send(error.message);
    }
});

commentRouter.post("/createcomment", async (req, res, next) => {
    try {
        let result = await createComment(req.body.commmentData);
        if (result instanceof Error || result === null) {
            return res.status(404).send(result);
        }
        return res.status(201).send(result);
    } catch (error) {
        console.log("500: Internal server error - " + error.message);
        res.status(500).send(error.message);
    }
});

commentRouter.delete("/deletecomment/:commentid", async (req, res, next) => {
    try {
        let result = await deleteComment(req.params.postid);
        if (result instanceof Error || result === null) {
            return res.status(404).send(result);
        }
        return res.status(200).send(result);
    } catch (error) {
        console.log("500: Internal server error - " + error.message);
        res.status(500).send(error.message);
    }
});

module.exports = commentRouter;
