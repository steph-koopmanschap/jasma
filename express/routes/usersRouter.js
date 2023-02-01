const express = require("express");
const isAuth = require("../middleware/isAuth");
const { getUserIdByUsername, getUserInfo, getProfilePic, getClientUser } = require("../controllers/users.js");

const usersRouter = express.Router();
usersRouter.get("/getClientUser", isAuth, getClientUser);
usersRouter.get("/getUserId/:username", getUserIdByUsername);
usersRouter.get("/:userid/UserInfo/", getUserInfo);
usersRouter.get("/:userid/profilepic", getProfilePic);

module.exports = { usersRouter };
