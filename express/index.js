/*
    ExpressJS Server initialization file
*/

require("dotenv").config();
const express = require("express");
const session = require("express-session");
let RedisStore = require("connect-redis")(session);
const Redis = require("ioredis");
const cors = require("cors");
//middleware imports
const helmet = require("helmet");
const customCors = require("./middleware/customCors.js");
const logging = require("./middleware/logging.js");
const { apiRouter } = require("./routes/apiRouter");
var path = require("path");

//Set the absolute directory path of the server(index.js) to the global namespace.
//This is needed for the server to find files in the /media/ directory
global.appRoot = path.resolve(__dirname);

const app = express();
//Number of proxies between express server and the client
//This is to make the rate limiter ignore proxy requests
//This is used when there are other services in front of Express such Nginx, Amazon Web, etc.
app.set("trust proxy", 1);

// LOAD MIDDLEWARES
//app.use(cors({ origin: "http://localhost:3000", credentials: true }));
customCors(app);
//Set http security headers
// app.use(helmet());
// logging(app);
let redisClient = new Redis();
app.use(
    session({
        store: new RedisStore({ client: redisClient }),
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET,
        resave: false
    })
);
//For parsing application/json
app.use(express.json());

// Mount router
app.use("/api", apiRouter);
//Media file fetching
app.get("/media/posts/:fileName", (req, res) => {
    const { fileName } = req.params;
    res.sendFile(`${__dirname}/media/posts/${fileName}`);
});
app.get("/media/comments/:fileName", (req, res) => {
    const { fileName } = req.params;
    res.sendFile(`${__dirname}/media/comments/${fileName}`);
});
app.get("/media/users/:userid/profile-pic.webp", (req, res) => {
    const { userid } = req.params;
    res.sendFile(`${__dirname}/media/users/${userid}/profile-pic.webp`);
});

//Start server
const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
    console.log(`
    ********************
    *   WELCOME TO     *
    ********************
        .-------.
        | JASMA |
        '-------'
    Just Another Social Media App
    `);
    console.log(`
    ============
    Starting the JASMA API server...
    Mode: ${process.env.NODE_ENV}
    ExpressJS server started...
    Listening on port ${port}...
    ------------
    Use CTRL+C to stop the server...
    `);
});

module.exports = { redisClient, server };
