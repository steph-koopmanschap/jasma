const express = require("express");
const apiRouter = express.Router();
const { authRouter } = require("./authRouter");
const { usersRouter } = require("./usersRouter");
const { postsRouter } = require("./postsRouter");
const { commentsRouter } = require("./commentsRouter");
const { searchRouter } = require("./searchRouter");
const { paymentsRouter } = require("./paymentsRouter");
// const { adsRouter } = require("./adsRouter");
const { reportsRouter } = require("./reportsRouter");
const { hashtagsRouter } = require("./hashtagsRouter");
const { notificationsRouter } = require("./notificationsRouter");

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/posts", postsRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/search", searchRouter);
//apiRouter.use("/payments", paymentsRouter);
// apiRouter.use("/ads", adsRouter);
apiRouter.use("/reports", reportsRouter);
apiRouter.use("/hashtags", hashtagsRouter);
apiRouter.use("/notifications", notificationsRouter);

module.exports = { apiRouter };
