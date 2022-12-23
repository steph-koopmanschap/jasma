const db = require("../db/connections/jasmaAdmin");
const { UserInfo } = db.models;

async function getProfilePic(req, res) {
    const { userid } = req.params;
    const options = {
        root: appRoot
    };
    //If userid is undefined postgresql will give an error and crash the server.
    //This if-block prevents the server from crashing and sends the default profile pic
    if (userid === 'undefined' || userid === undefined || userid === false || userid === 'null' || userid === null) {
        res.sendFile("/media/users/00000000-0000-0000-0000-000000000000/profile-pic.webp", options, (err) => {
            if (err) {
                res.json({ success: false, message: "File not found." });
            }
        });
        return 1;
    }
    const fileUrlObj = await UserInfo.getProfilePicUrl(userid);
    const fileUrl = fileUrlObj.profile_pic_url;
    
    res.sendFile(fileUrl, options, (err) => {
        if (err) {
            res.json({ success: false, message: "File not found." });
        }
    });
}

module.exports = {
    getProfilePic
};
