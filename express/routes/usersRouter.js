const express = require("express");
const { getUserIdByUsername, getProfilePic } = require("../controllers/users.js");

const usersRouter = express.Router();

usersRouter.get('/getUserId/:username', getUserIdByUsername); 
usersRouter.get('/:userid/profilepic', getProfilePic);

module.exports = { usersRouter };
