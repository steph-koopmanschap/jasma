/*
    ExpressJS Server initialization file
*/

//Imports
const express = require('express');
//Load the .env config file
require('dotenv').config();
//import middlewares
const logging = require("./middlewares/logging.js");
const loadRouters = require('./middlewares/routes.js');
//Import connection for PostGreSQL
const pool = require("./db/dbConnect.js");

//Initialize expressJS
const app = express();
//Number of proxies between express server and the client
//This is to make the rate limiter ignore proxy requests
app.set('trust proxy', 1);
//Set port
var port = parseInt(process.env.PORT || '3001', 10);

// =================================================================
// LOAD MIDDLEWARES
//For parsing application/json. Required to read the req.body object
app.use(express.json());
logging(app);
loadRouters(app);
// =================================================================

//Start server
app.listen(port, async () => {
    console.log("============");
    console.log(`Starting the JASMA API server...`);
    console.log(`Mode: ${process.env.NODE_ENV}`);
    console.log("Testing the PostGreSQL database connection...");

    let test = await pool.query(
        `
        SELECT NOW() 
        `
    );

    if (!test || !test.rows || !test.rows.length ) {
        let err = new Error(`Error: Database connection failed.`);
        console.log(err);
    }
    else 
    {
        console.log(`Database connection success @ ${JSON.stringify(test.rows[0].now)}`);
    }

    console.log(`ExpressJS server started...`);
    console.log(`Listening on "${process.env.BASE_URL}:${port}"...`);
    console.log("------------"); 
    console.log(`Use CTRL+C to stop the server...`);
});

module.exports = app;

