const express = require("express");
const apiRouter = express.Router();
const { authRouter } = require("./authRouter");
const { usersRouter } = require("./usersRouter");
const { postsRouter } = require("./postsRouter");
const { commentsRouter } = require("./commentsRouter");
// const { adsRouter } = require("./adsRouter");
// const { searchRouter } = require("./searchRouter");

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/posts", postsRouter);
apiRouter.use("/comments", commentsRouter);
// apiRouter.use("/ads", adsRouter);
// apiRouter.use("/search", searchRouter);

module.exports = { apiRouter };
