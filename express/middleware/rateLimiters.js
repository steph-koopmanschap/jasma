const rateLimit = require("express-rate-limit");
const isLocalhost = require("is-localhost-ip");
const allowList = [];
const registrationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Limit each IP to 5 successful create account requests per 'window' (here, per hour)
    message: "Too many accounts created from this IP, please try again after an hour",
    standardHeaders: true, // Return rate limit info in the 'RateLimit-*' headers
    legacyHeaders: false, // Disable the 'X-RateLimit-*' headers,
    skip: async (req, res) => {
        const isLocalHostIp = await isLocalhost(req.ip);
        if (allowList.includes(req.ip) || isLocalHostIp) {
            return true;
        }

        if (!res.success) {
            return true;
        }
    }
});

const loginLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 6,
    message: "Too many login attempts. Please try again in 5 minutes.",
    standardHeaders: true,
    legacyHeaders: false,
    skip: async (req, res) => {
        const isLocalHostIp = await isLocalhost(req.ip);
        if (allowList.includes(req.ip) || isLocalHostIp) {
            return true;
        }
    }
});

module.exports = { registrationLimiter, loginLimiter };
