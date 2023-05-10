const express = require("express");
const { uploadPicLimiter, followerLimiter } = require("../middleware/rateLimiters");
const isAuth = require("../middleware/isAuth.js");
const isAuthIsAdmin = require("../middleware/isAuthIsAdmin.js");
const { multipartHandler } = require("../middleware/multipartHandler");
const { getUserIdByUsername, 
        getUserInfo, 
        getProfilePic,
        uploadProfilePic,
        addFollower,
        removeFollower,
        getFollowers,
        getFollowing,
        checkIsFollowing,
        getClientUser,
        getUserIDsByRole,
        changeUserRole} = require("../controllers/users.js");

const usersRouter = express.Router();
usersRouter.get("/getClientUser", isAuth, getClientUser);
usersRouter.get("/getUserId/:username", getUserIdByUsername);
usersRouter.get("/:userid/UserInfo", getUserInfo);
usersRouter.get("/:userid/profilepic", getProfilePic);
usersRouter.put("/uploadProfilePic", uploadPicLimiter, isAuth, multipartHandler, uploadProfilePic);
usersRouter.post('/addFollower', followerLimiter, isAuth, addFollower);
usersRouter.delete('/removeFollower/:userID_two', followerLimiter, isAuth, removeFollower);
usersRouter.get('/:userID/getFollowers', getFollowers);
usersRouter.get('/:userID/getFollowing', getFollowing);
usersRouter.get('/checkIsFollowing/:userID_two', isAuth, checkIsFollowing);
// /getUsersByRole/:role?limit=50
usersRouter.get('/getUsersByRole/:role', isAuth, getUserIDsByRole);
usersRouter.put('/changeUserRole', isAuth, changeUserRole);
//Replace above lines with below lines when CMS is done.
// usersRouter.get('/getUsersByRole/:role', isAuthIsAdmin, getUserIDsByRole);
// usersRouter.put('/changeUserRole', isAuthIsAdmin, changeUserRole);

module.exports = { usersRouter };
