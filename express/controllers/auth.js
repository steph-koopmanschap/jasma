const bcrypt = require("bcrypt");
const { createUserDB, getUserByEmailDB, getUserByUsernameDB } = require("../models/User");
const { updateUserMetadataDB } = require("../models/UserMetadata");
const { format } = require("date-fns");

async function register(req, res) {
    const { newUser, password } = req.body;
    const usernameExists = await getUserByUsernameDB(newUser.username);
    const emailExists = await getUserByEmailDB(newUser.email);
    if (usernameExists || emailExists) {
        return res.json({ success: false, message: "Username or Email already in use" });
    }
    await createUserDB(newUser);
    await createUserPasswordDB(newUser.email, password);
    res.json({ success: true });
}

async function login(req, res) {
    const { email, password } = req.body;
    const isCorrectPassword = await comparePasswordsDB(email, password);
    if (!isCorrectPassword) {
        return res.json({ success: false, message: "Email or Password is incorrect" });
    }

    const { user_id } = await getUserByEmailDB(email);
    await updateUserMetadataDB(user_id, { last_login_date: format(Date.now(), "MM/dd/yyyy"), last_ipv4: req.ip });
    req.session.user_id = user_id;
    res.json({ success: true, user });
}

async function logout(req, res) {
    req.session.destroy((err) => {
        if (err) {
            res.json({ success: false, message: "Unable to logout" });
        } else {
            res.json({ success: true });
        }
    });
}

module.exports = { register, login, logout };
