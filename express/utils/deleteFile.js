//const util = require('util');
const fs = require('fs');
//const unlink = util.promisify(fs.unlink);

const serverURL = `${process.env.HOSTNAME}:${process.env.PORT}`;

async function deleteFile(filePath) {
    //Strip the hostname and port from the filePath.
    //This is because references to files are stored as url in the database.
    if (filePath.includes("http")) {
        filePath = filePath.replace(serverURL, "");
    }
    const absolutePath = appRoot + filePath;

    try {
        //First check if the file exists before deleting it. 
        //Or else we get the following error (if the file does not exist)
        //Error: EISDIR: illegal operation on a directory, unlink. Errorno: 21
        await fs.promises.access(absolutePath, fs.constants.F_OK);
        //Delete the delete
        fs.unlink(absolutePath);
        //File deleted.
        return true;
    }
    catch (err) {
        console.error(err);
        return false;
    }
}

module.exports = {deleteFile};
