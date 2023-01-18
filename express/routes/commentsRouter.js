const express = require("express");
const { getComments } = require("../controllers/comments.js")

const commentsRouter = express.Router();

// api/comments/getComments?post_id=UUID&limit=50
commentsRouter.get('/getComments', getComments);

module.exports = { commentsRouter };
