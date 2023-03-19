/*
    ExpressJS Server initialization file
*/

require("dotenv").config();
const express = require("express");
const session = require("express-session");
let RedisStore = require("connect-redis")(session);
const Redis = require("ioredis");
//const cors = require("cors");
//middleware imports
const helmet = require("helmet");
const { globalLimiter } = require("./middleware/rateLimiters.js");
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
// Apply the global rate limiter to all routes
app.use(globalLimiter);
//app.use(cors({ origin: "http://localhost:3000", credentials: true }));
customCors(app);
//Set http security headers
app.use(helmet());
// logging(app);

//Use a URL for Redis in production mode 
const redisClient = (process.env.NODE_ENV === 'production' && process.env.REDIS_URL !== "")
    ? new Redis(process.env.REDIS_URL)
    : new Redis();

//Cookie sessions are stored in Redis
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
app.get("/media/:folderName/:fileName", (req, res) => {
    const { folderName, fileName } = req.params;
    const folders = [
        "ads",
        "avatars",
        "posts",
        "comments"
    ]
    //Check if the folderName exists. Then send the file.
    if (folders.indexOf(folderName) >= 0) {
        res.sendFile(`${__dirname}/media/${folderName}/${fileName}`)
    } 
    else 
    {
        //Folder or file not found
        res.sendStatus(404);
    }
});
// OLD CODE
// app.get("/media/users/:userid/profile-pic.webp", (req, res) => {
//     const { userid } = req.params;
//     res.sendFile(`${__dirname}/media/users/${userid}/profile-pic.webp`);
// });

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
