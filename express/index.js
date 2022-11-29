require("dotenv").config();
const express = require("express");
const app = express();
const session = require("express-session");
let RedisStore = require("connect-redis")(session);
const Redis = require("ioredis");
const helmet = require("helmet");
const logging = require("./middleware/logging.js");
const { apiRouter } = require("./routes/apiRouter");

app.use(helmet());
// logging(app);
let redisClient = new Redis();
app.use(
    session({
        store: new RedisStore({ client: redisClient }),
        saveUninitialized: false,
        secret: "keyboard cat",
        resave: false
    })
);

app.use(express.json());

app.use("/api", apiRouter);

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
    console.log(`
    ============
    Starting the JASMA API server...
    Mode: ${process.env.NODE_ENV}
    ExpressJS server started...
    Listening on port ${port}"...
    ------------
    Use CTRL+C to stop the server...
    `);
});

module.exports = { redisClient, server };
