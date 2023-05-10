const fs = require("fs");

function readFile(fileName) {
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, 'utf8', function (error, data) {
            if (error) {
                return reject(error);
            }
            resolve();
        })
    });
}

module.exports = {readFile};
