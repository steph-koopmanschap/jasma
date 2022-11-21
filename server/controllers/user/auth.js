const bcrypt = require("bcrypt");
const { createUser, getUserByEmail, getUserByName } = require("../../db/models/User");

async function register(req, res) {
    const { newUser } = req.body;
    const usernameExists = await getUserByName(newUser.username);
    const emailExists = await getUserByEmail(newUser.email);
    if (usernameExists || emailExists) {
        return res.json({ success: false });
    }
    await createUser(newUser);
    return res.json({ success: true });
}

async function login(req, res) {
    const { email, password } = req.body;
    const user = await getUserByEmail(email);
    const isCorrectPassword = await bcrypt.compare(password, user.user_password);
    if (isCorrectPassword) {
        // initialize session.
        // return res.json({success: true})
    }

    return res.json({ success: false });
}

async function logout(req, res) {
    // destroy session
    // return res.json({success: true})
}

module.exports = { register, login, logout };
