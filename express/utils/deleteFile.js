const fs = require("fs");

const serverURL = `${process.env.HOSTNAME}:${process.env.PORT}`;

async function deleteFile(filePath) {
    //Strip the hostname and port from the filePath.
    //This is because references to files are stored as url in the database.
    if (filePath.includes("http")) {
        filePath = filePath.replace(serverURL, "");
    }
    const absolutePath = appRoot + filePath;

    fs.unlink(absolutePath, err => {
        if (err) {
            console.log (err);
            //File not deleted
            return false;
        }
    });
    //File deleted.
    return true;
}

module.exports = {deleteFile};
