const express = require("express");
const { registrationLimiter, AuthLimiter } = require("../middleware/rateLimiters");
const validateRegistration = require("../middleware/validation/register");
const validateChangePassword = require("../middleware/validation/changePassword");
const { checkValidation } = require("../middleware/validation/validationResult");
const isAuth = require("../middleware/isAuth.js");
const { register, login, logout, checkAuth, checkAuthUserRole, changePassword } = require("../controllers/auth");

const authRouter = express.Router();

authRouter.post("/register", registrationLimiter, validateRegistration, checkValidation, register);
authRouter.post("/login", AuthLimiter, login);
authRouter.post("/logout", AuthLimiter, logout);
authRouter.post("/checkAuth", checkAuth);
authRouter.post("/checkAuthUserRole", checkAuthUserRole);
authRouter.post("/changePassword", AuthLimiter, isAuth, validateChangePassword, checkValidation, changePassword);

module.exports = { authRouter };
