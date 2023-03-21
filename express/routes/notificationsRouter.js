const express = require("express");
const isAuth = require("../middleware/isAuth.js");
const {  } = require("../controllers/notifications.js");

const notificationsRouter = express.Router();

notificationsRouter.get("/getNotifications", isAuth, getNotifications);
notificationsRouter.put("/readNotification", isAuth, readNotification);

module.exports = { notificationsRouter };
