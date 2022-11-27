const { updateUserInfoDB } = require("../models/UserInfo");

async function updateUserInfo(req, res) {
    const { updatedUserInfo } = req.body;
    const userInfo = await updateUserInfoDB(updatedUserInfo);
    res.json({ userInfo });
}

module.exports = { updateUserInfo };
