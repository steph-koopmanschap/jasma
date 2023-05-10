//logging middleware
const logger = require("morgan");
const path = require("path");
const { format } = require("date-fns");
//Rotating file logging
const rfs = require("rotating-file-stream");

function logging(app) {
    const { NODE_ENV } = process.env;
    const logFileName = `${format(Date.now(), "MM-dd-yyyy")}-server.log`;
    const logDirectory = path.resolve(__dirname, "../logs");

    try {
        // Create a rotating write stream
        const serverLogStream = rfs.createStream(logFileName, {
            interval: "1d", // rotate daily
            path: path.join(__dirname, "../logs/") //logDirectory
        });
    }
    catch (e) {
        console.error("Error creating log stream:", e);
    }

    //Enable logging middleware based on mode
    if (NODE_ENV === "development") {
        //:method :url :status :response-time ms - :res[content-length]
        app.use(logger("dev"));
    } else if (NODE_ENV === "production") {
        //:remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]
        app.use(logger("common"));
    }
    //Log to file
    app.use(logger("combined", { stream: serverLogStream }));
}

module.exports = logging;
