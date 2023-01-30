const express = require("express");
const isAuth = require("../middleware/isAuth.js");
const { createComment, deleteComment, editComment, getComments } = require("../controllers/comments.js");
const { multipartHandler } = require("../middleware/multipartHandler");

const commentsRouter = express.Router();

commentsRouter.post('/createComment', isAuth, multipartHandler, createComment);
commentsRouter.delete("/deleteComment/:commentID", isAuth, deleteComment);
commentsRouter.put("/editComment", isAuth, editComment);

// api/comments/getComments?post_id=UUID&limit=50
commentsRouter.get('/getComments', getComments);

module.exports = { commentsRouter };
