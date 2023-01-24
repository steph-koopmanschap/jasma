const express = require("express");
const isAuth = require("../middleware/isAuth.js");
const { createComment, getComments } = require("../controllers/comments.js")

const commentsRouter = express.Router();

commentsRouter.post('/createComment', isAuth, createComment);

// api/comments/getComments?post_id=UUID&limit=50
commentsRouter.get('/getComments', getComments);

module.exports = { commentsRouter };
