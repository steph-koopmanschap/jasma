const express = require("express");
const { register, login, logout } = require("../controllers/auth");
const { registrationLimiter } = require("../middleware/rateLimiters");
const validateRegistration = require("../middleware/validation/register");
const { checkValidation } = require("../middleware/validation/validationResult");

const authRouter = express.Router();

authRouter.post("/register", registrationLimiter, validateRegistration, checkValidation, register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);

module.exports = { authRouter };
