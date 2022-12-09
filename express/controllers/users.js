const db = require("../db/connections/jasmaAdmin");
const { UserInfo } = db.models;
const readFile = require("../utils/readFile.js");

async function getProfilePic(req, res) {
    const { userid } = req.params.userid;
    console.log(userid);
    const fileUrl = await UserInfo.getProfilePicUrl(userid);
    console.log("fileUrl:");
    console.log(fileUrl);
            //const file = await readFile(fileUrl);
    res.sendFile(fileUrl, options, (err) => {
        if (err) {
            res.json({ success: false, message: "File not found." });
        }
    });
}

module.exports = {
    getProfilePic
};