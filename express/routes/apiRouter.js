const express = require("express");
const apiRouter = express.Router();
const { authRouter } = require("./authRouter");
const { usersRouter } = require("./usersRouter");
const { postsRouter } = require("./postsRouter");
const { commentsRouter } = require("./commentsRouter");
const { searchRouter } = require("./searchRouter");
// const { adsRouter } = require("./adsRouter");

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/posts", postsRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/search", searchRouter);
// apiRouter.use("/ads", adsRouter);

module.exports = { apiRouter };
