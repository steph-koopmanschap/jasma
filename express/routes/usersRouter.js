const express = require("express");
const { getProfilePic } = require("../controllers/users.js")

const usersRouter = express.Router();

usersRouter.get('/:userid/profilepic', getProfilePic);

module.exports = { usersRouter };
