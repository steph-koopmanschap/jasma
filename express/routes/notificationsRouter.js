const express = require("express");
const isAuth = require("../middleware/isAuth.js");
const { notificationLimiter } = require("../middleware/rateLimiters");
const { getNotifications, readNotification } = require("../controllers/notifications.js");

const notificationsRouter = express.Router();

notificationsRouter.get("/getNotifications", notificationLimiter, isAuth, getNotifications);
notificationsRouter.put("/readNotification", notificationLimiter, isAuth, readNotification);

module.exports = { notificationsRouter };
