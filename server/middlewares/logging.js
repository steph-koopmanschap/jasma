//logging middleware
var logger = require('morgan');
var path   = require('path');
//Rotating file logging
const rfs  = require("rotating-file-stream");
const formatDateToStr = require("../utils/formatDateToStr.js");

function logging(app) {
    // Create a rotating write stream
    var serverLogStream = rfs.createStream(`${formatDateToStr(new Date(), "DD-MM-YYYY", "-")}-server.log`, {
        interval: '1d', // rotate daily
        path: path.join(__dirname, '../logs/')
    });

    //Enable logging middleware based on mode
    if (process.env.NODE_ENV === "development") {
        //:method :url :status :response-time ms - :res[content-length]
        app.use(logger('dev'));
    } 
    else if (process.env.NODE_ENV === "production") {
        //:remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]
        app.use(logger('common'));
    }
    //Log to file
    app.use(logger('combined', { stream: serverLogStream }));
}

module.exports = logging;
