const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
const helmet = require("helmet");
const busboy = require("busboy");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const util = require("node:util");
const exec = util.promisify(require("node:child_process").exec);
const cors = require("cors");

app.use(helmet());
app.use(cors({ origin: "http://localhost:3000" }));

io.on("connection", (socket) => {
    console.log("socket id on server", socket.id);
});

app.use((req, res, next) => {
    req.io = io;
    next();
});

if (!fs.existsSync("./uploads")) {
    fs.mkdirSync("./uploads");
}

app.get("/media/:folder/:fileName", (req, res) => {
    const { folder, fileName } = req.params;
    fs.readFile(`./uploads/${folder}/${fileName}`, function (error, content) {
        res.end(content, "utf-8");
    });
});

const getFileExtension = (info) => info.mimeType.match(/(?<=\/).+/)[0];

async function videoToHls(filePath, folderPath, req, socketId) {
    try {
        const { stdout, stderr } = await exec(
            `ffmpeg -i ${filePath} -profile:v main -pix_fmt yuv420p -level 3.0 -start_number 0 -hls_time 10 -hls_list_size 0 -f hls ${folderPath}/index.m3u8`
        );
        return { stdout, stderr };
    } catch (err) {
        console.log(err);
    }
}

app.post("/upload", async (req, res) => {
    try {
        const bb = busboy({ headers: req.headers });
        const mediaId = uuidv4();
        const folderPath = `./uploads/${mediaId}`;
        let tempFilePath;
        let fileExtension;
        let socketId;

        bb.on("field", (name, val, info) => {
            if (name === "socketId") {
                socketId = val;
            }
        });

        bb.on("file", (name, file, info) => {
            req.io.to(socketId).emit("statusUpdate", "Uploading");
            fileExtension = getFileExtension(info);
            tempFilePath = `${folderPath}/temp.${fileExtension}`;

            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath);
            }

            const writeStream = fs.createWriteStream(tempFilePath);
            file.pipe(writeStream);
        });

        bb.on("close", async () => {
            req.io.to(socketId).emit("statusUpdate", "Formatting");
            const result = await videoToHls(tempFilePath, folderPath, req, socketId);
            if (!result) {
                req.io.to(socketId).emit("statusUpdate", "Something went wrong");
            } else {
                req.io.to(socketId).emit("statusUpdate", "Upload complete");
            }

            fs.unlinkSync(tempFilePath);

            res.json({ hlsURL: `http://localhost:5000/media/${mediaId}/index.m3u8` });
        });

        req.pipe(bb);
    } catch (err) {
        console.log(err);
    }
});

server.listen(5000);
