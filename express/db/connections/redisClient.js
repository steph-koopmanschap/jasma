const Redis = require("ioredis");

//Use a URL for Redis in production mode 
const redisClient = (process.env.NODE_ENV === 'production' && process.env.REDIS_URL !== "")
    ? new Redis(process.env.REDIS_URL)
    : new Redis();

module.exports = { redisClient };
