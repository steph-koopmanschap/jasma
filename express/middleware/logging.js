//logging middleware
var logger = require("morgan");
var path = require("path");
const { format } = require("date-fns");
//Rotating file logging
const rfs = require("rotating-file-stream");

function logging(app) {
    // Create a rotating write stream
    var serverLogStream = rfs.createStream(`${format(Date.now(), "MM-dd-yyyy")}-server.log`, {
        interval: "1d", // rotate daily
        path: path.join(__dirname, "../logs/")
    });

    //Enable logging middleware based on mode
    if (process.env.NODE_ENV === "development") {
        //:method :url :status :response-time ms - :res[content-length]
        app.use(logger("dev"));
    } else if (process.env.NODE_ENV === "production") {
        //:remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]
        app.use(logger("common"));
    }
    //Log to file
    app.use(logger("combined", { stream: serverLogStream }));
}

module.exports = logging;
