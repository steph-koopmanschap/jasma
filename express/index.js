/*
    ExpressJS Server initialization file
*/

require("dotenv").config();
const express = require("express");
const session = require("express-session");
const { redisClient } = require("./db/connections/redisClient.js");
let RedisStore = require("connect-redis").default;//(session);
//middleware imports
const csrf = require('csurf'); //WARNING: csurf package is deprecated. Find an alternative ASAP
const cookieParser = require('cookie-parser');
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
customCors(app);
//Set http security headers
app.use(helmet());
// logging(app);

//Cookie sessions are stored in Redis
//Note:
//We probably dont need to use 
/*
cookie: {
            secure: true
        }
*/

// Initialize the Redis store.
let redisStore = new RedisStore({
    client: redisClient,
    //prefix: "myapp:",
})

//Because the express server is behind a HTTPS Nginx reverse proxy which will handle the SSL
app.use(
    session({
        store: redisStore,
        saveUninitialized: false,
        resave: false,
        secret: process.env.SESSION_SECRET,
        cookie: {
            httpOnly: true,
            sameSite: 'strict'
        }
    })
);

//CSRF (Cross-site request forgery) Protection
const csrfProtection = csrf({ cookie: true, key: 'XSRF-TOKEN' });
// const csrfProtection = csrf({
//     cookie: {
//         secure: true,
//         sameSite: 'strict'
//     }
// });

// parse cookies
// we need this because "cookie" is true in csrfProtection
app.use(cookieParser());

//For parsing application/json
app.use(express.json());

// Middleware for POST, PUT, and DELETE requests only
// Used for checking the CSRF protection middleware only on resource modifying requests.
// app.use((req, res, next) => {
//     if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
//         csrfProtection(req, res, next);
//         res.cookie('_csrf', req.csrfToken());
//     }
//     next();
// });

//Give the CSRF token to the client.
app.get("/requestCSRF-TOKEN", csrfProtection, (req, res) => {
    const token = req.csrfToken();
    console.log("token: ", token);
    res.cookie('_csrf', token);
    res.json({ success: true, csrfToken: token });
});

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

module.exports = { server };
