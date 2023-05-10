const Redis = require("ioredis");

//Use a URL for Redis in production mode 
const redisClient = new Redis({
    port: process.env.REDIS_PORT, 
    host: process.env.REDIS_HOST
});

module.exports = { redisClient };
