const rateLimit = require("express-rate-limit");
const isLocalhost = require("is-localhost-ip");
const allowList = [];

//COMMON TIME LIMITS IN MILISECONDS:
const SECOND = 1000;
const HALF_MINUTE = 30 * SECOND;
const MINUTE = HALF_MINUTE * 2;
const HALF_HOUR = 30 * MINUTE
const HOUR = 2 * HALF_HOUR;

//Function for bypassing the rate limiter on certain conditions
async function skipRateLimiter(req, res) {
    const isLocalHostIp = await isLocalhost(req.ip);
    //Do not apply rate limiter to IP in the allowlist and local IPs
    if (allowList.includes(req.ip) || isLocalHostIp) {
        return true;
    }
    //Do not apply rate limiter to requests that fail.
    if (!res.success) {
        return true;
    }
}

const globalLimiter = rateLimit({
    windowMs: MINUTE, // 1 minute
    max: 1000, // Limit each IP to 1000 requests per 'window' (here, per 1 minute)
    message: "Too many requests. You are being limited. Try again later.",
    standardHeaders: true, // Return rate limit info in the 'RateLimit-*' headers
    legacyHeaders: false, // Disable the 'X-RateLimit-*' headers,
    skip: skipRateLimiter
});

const registrationLimiter = rateLimit({
    windowMs: HOUR, 
    max: 5, 
    message: "Too many accounts created from this IP, please try again after an hour",
    standardHeaders: true,
    legacyHeaders: false,
    skip: skipRateLimiter
});

const getTopHashtagsLimiter = rateLimit({
    windowMs: 6 * HOUR, // 6 hours
    max: 2, 
    message: "Too many requests from this IP, please try again after 6 hours.",
    standardHeaders: true, 
    legacyHeaders: false, 
    skip: skipRateLimiter
});

const searchLimiter = rateLimit({
    windowMs: HALF_MINUTE, 
    max: 10, 
    message: "Too many search requests from this IP, please try again after 30 seconds.",
    standardHeaders: true,
    legacyHeaders: false,
    skip: skipRateLimiter
});

const newsFeedLimiter = rateLimit({
    windowMs: MINUTE,
    max: 60,
    message: "Too many newsfeed requests from this IP, please try again after 1 minute.",
    standardHeaders: true,
    legacyHeaders: false, 
    skip: skipRateLimiter
});

//Limits for post and comment manpipulation: 
//create, edit, delete
const postsAndCommentsLimiter = rateLimit({
    windowMs: MINUTE, 
    max: 10, 
    message: "Too many post manipulation requests from this IP, please try again after 1 minute.",
    standardHeaders: true, 
    legacyHeaders: false, 
    skip: skipRateLimiter
});

const uploadPicLimiter = rateLimit({
    windowMs: MINUTE, 
    max: 5, 
    message: "Too many post upload requests from this IP, please try again after 1 minute.",
    standardHeaders: true,
    legacyHeaders: false, 
    skip: skipRateLimiter
});

const followerLimiter = rateLimit({
    windowMs: HOUR, //ALTERNATIVE: windowMs: MINUTE, // 1 minute
    max: 300,
    message: "Too many followers added from this IP, please try again after 1 hour.",
    standardHeaders: true,
    legacyHeaders: false,
    skip: skipRateLimiter
});

const paymentLimiter = rateLimit({
    windowMs: MINUTE, 
    max: 10,
    message: "Too payment requests from this IP, please try again after 1 minute.",
    standardHeaders: true,
    legacyHeaders: false, 
    skip: skipRateLimiter
});

const AuthLimiter = rateLimit({
    windowMs: MINUTE, 
    max: 10, 
    message: "Too many auth requests from this IP, please try again after 1 minute.",
    standardHeaders: true, 
    legacyHeaders: false, 
    skip: skipRateLimiter
});

const notificationLimiter = rateLimit({
    windowMs: HALF_MINUTE, 
    max: 10, 
    message: "Too many notification requests from this IP, please try again after 30 seconds.",
    standardHeaders: true, 
    legacyHeaders: false,
});

module.exports = { 
                    globalLimiter, 
                    registrationLimiter,
                    getTopHashtagsLimiter,
                    searchLimiter,
                    newsFeedLimiter,
                    postsAndCommentsLimiter,
                    uploadPicLimiter,
                    followerLimiter,
                    paymentLimiter,
                    AuthLimiter,
                    notificationLimiter
                };
