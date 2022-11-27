const { updateUserDB } = require("../models/User");

async function updateUser(req, res) {
    const { updatedUser } = req.body;
    await updateUserDB(updatedUser);
    return res.send({ success: true });
}

module.exports = { updateUser };
