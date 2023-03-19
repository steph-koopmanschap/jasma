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
    windowMs: HOUR, // 1 hour
    max: 5, // Limit each IP to 5 successful create account requests per 'window' (here, per hour)
    message: "Too many accounts created from this IP, please try again after an hour",
    standardHeaders: true, // Return rate limit info in the 'RateLimit-*' headers
    legacyHeaders: false, // Disable the 'X-RateLimit-*' headers,
    skip: skipRateLimiter
});

const getTopHashtagsLimiter = rateLimit({
    windowMs: 6 * HOUR, // 6 hours
    max: 2, // Limit each IP to 2 successful get top hashtags request per 'window' (here, per 6 hours)
    message: "Too many requests from this IP, please try again after 6 hours.",
    standardHeaders: true, // Return rate limit info in the 'RateLimit-*' headers
    legacyHeaders: false, // Disable the 'X-RateLimit-*' headers,
    skip: skipRateLimiter
});

const searchLimiter = rateLimit({
    windowMs: HALF_MINUTE, // 30 seconds
    max: 10, // Limit each IP to 10 successful search request per 'window' (here, per 30 seconds)
    message: "Too many search requests from this IP, please try again after 30 seconds.",
    standardHeaders: true, // Return rate limit info in the 'RateLimit-*' headers
    legacyHeaders: false, // Disable the 'X-RateLimit-*' headers,
    skip: skipRateLimiter
});

const newsFeedLimiter = rateLimit({
    windowMs: MINUTE, // 1 minute
    max: 60, // Limit each IP to 60 successful newsfeed request per 'window' (here, per 60 seconds)
    message: "Too many newsfeed requests from this IP, please try again after 1 minute.",
    standardHeaders: true, // Return rate limit info in the 'RateLimit-*' headers
    legacyHeaders: false, // Disable the 'X-RateLimit-*' headers,
    skip: skipRateLimiter
});

//Limits for post and comment manpipulation: 
//create, edit, delete
const postsAndCommentsLimiter = rateLimit({
    windowMs: MINUTE, // 1 minute
    max: 10, // Limit each IP to 10 successful manipulation requests per 'window' (here, per 60 seconds)
    message: "Too many post manipulation requests from this IP, please try again after 1 minute.",
    standardHeaders: true, // Return rate limit info in the 'RateLimit-*' headers
    legacyHeaders: false, // Disable the 'X-RateLimit-*' headers,
    skip: skipRateLimiter
});

const uploadPicLimiter = rateLimit({
    windowMs: MINUTE, // 1 minute
    max: 5, // Limit each IP to 5 pic upload requests per 'window' (here, per 60 seconds)
    message: "Too many post upload requests from this IP, please try again after 1 minute.",
    standardHeaders: true, // Return rate limit info in the 'RateLimit-*' headers
    legacyHeaders: false, // Disable the 'X-RateLimit-*' headers,
    skip: skipRateLimiter
});

const followerLimiter = rateLimit({
    windowMs: HOUR, //ALTERNATIVE: windowMs: MINUTE, // 1 minute
    max: 300, //ALTERNATIVE: max: 5, // Limit each IP to 300 successful add follower requests per 'window' (here, per 60 seconds)
    message: "Too many followers added from this IP, please try again after 1 hour.",
    standardHeaders: true, // Return rate limit info in the 'RateLimit-*' headers
    legacyHeaders: false, // Disable the 'X-RateLimit-*' headers,
    skip: skipRateLimiter
});

const paymentLimiter = rateLimit({
    windowMs: MINUTE, /// 1 minute
    max: 10, // Limit each IP to 10 successful payment requests per 'window' (here, per 60 seconds)
    message: "Too payment requests from this IP, please try again after 1 minute.",
    standardHeaders: true, // Return rate limit info in the 'RateLimit-*' headers
    legacyHeaders: false, // Disable the 'X-RateLimit-*' headers,
    skip: skipRateLimiter
});

const AuthLimiter = rateLimit({
    windowMs: MINUTE, /// 1 minute
    max: 10, // Limit each IP to 10 auth requests per 'window' (here, per 60 seconds)
    message: "Too auth requests from this IP, please try again after 1 minute.",
    standardHeaders: true, // Return rate limit info in the 'RateLimit-*' headers
    legacyHeaders: false, // Disable the 'X-RateLimit-*' headers,
    skip: skipRateLimiter
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
                    AuthLimiter
                };
