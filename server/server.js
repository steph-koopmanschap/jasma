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
    //const pool = require("./lib/dbConnect.js");
//Simple test route
const testResponse = require("./routes/testResponse.js");

//Initialize expressJS
const app = express();
//Set port
var port = parseInt(process.env.PORT || '3001', 10);

// =================================================================
// LOAD MIDDLEWARES
logging(app);
loadRouters(app);
// =================================================================

//Basic server response test
app.all('/test', testResponse);

//Start server
app.listen(port, async () => {
    console.log("============");
    console.log(`Starting the JASMA API server...`);
    console.log(`Mode: ${process.env.NODE_ENV}`);
    console.log("Testing the PostGreSQL database connection...");

    // let test = await pool.query(
    //     `
    //     SELECT NOW() 
    //     `);

    // if (!test || !test.rows || !test.rows.length ) {
    //     let err = new Error(`Error: Database connection failed.`);
    //     console.log(err);
    // }
    // else 
    // {
    //     console.log(`Database connection success @ ${JSON.stringify(test.rows[0].now)}`);
    // }
    console.log(`ExpressJS server started...`);
    console.log(`Listening on "${process.env.BASE_URL}:${port}"...`);
    console.log("------------"); 
    console.log(`Use CTRL+C to stop the server...`);
});

module.exports = app;

