const { register, login, logout } = require("../controllers/user/auth.js");
const rateLimit = require("express-rate-limit");
const registrationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Limit each IP to 5 create account requests per 'window' (here, per hour)
    message: "Too many accounts created from this IP, please try again after an hour",
    standardHeaders: true, // Return rate limit info in the 'RateLimit-*' headers
    legacyHeaders: false // Disable the 'X-RateLimit-*' headers
});

const authRouter = express.Router();

authRouter.post("/register", registrationLimiter, register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
