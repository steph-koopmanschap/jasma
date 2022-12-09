const db = require("../db/connections/jasmaAdmin");
const { UserInfo } = db.models;
const readFile = require("../utils/readFile.js");
const path = require('path');

async function getProfilePic(req, res) {
    const { userid } = req.params;
    const fileUrlObj = await UserInfo.getProfilePicUrl(userid);
    const fileUrl = fileUrlObj.profile_pic_url;
    const options = {
        root: appRoot
    };    
    res.sendFile(fileUrl, options, (err) => {
        if (err) {
            res.json({ success: false, message: "File not found." });
        }
    });
}

module.exports = {
    getProfilePic
};
