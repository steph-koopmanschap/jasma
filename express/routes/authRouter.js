const express = require("express");
const { registrationLimiter } = require("../middleware/rateLimiters");
const validateRegistration = require("../middleware/validation/register");
const { checkValidation } = require("../middleware/validation/validationResult");
const isAuth = require("../middleware/isAuth.js");
const { register, login, logout, checkAuth, changePassword } = require("../controllers/auth");

const authRouter = express.Router();

authRouter.post("/register", registrationLimiter, validateRegistration, checkValidation, register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/checkAuth", checkAuth);
authRouter.post("/changePassword", isAuth, changePassword);

module.exports = { authRouter };
