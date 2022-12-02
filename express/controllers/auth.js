const db = require("../db/connections/jasmaAdmin");
const { User, UserPassword, UserMetadata } = db.models;
const { formatISO } = require("date-fns");

async function register(req, res) {
    const { username, email, password } = req.body;
    const usernameExists = await User.getByUsername(username);
    if (usernameExists) {
        return res.json({ success: false, message: "Username already in use" });
    }

    const emailExists = await User.getByEmail(email);
    if (emailExists) {
        return res.json({ success: false, message: "Email already in use" });
    }

    const t = await db.transaction();
    try {
        await User.create({ username, email });
        await UserPassword.create({ user_email: email, user_password: password });
    } catch (err) {
        await t.rollback();
        throw new Error(err);
    }

    res.json({ success: true });
}

async function login(req, res) {
    const { email, password } = req.body;

    const user = await User.getByEmail(email);
    if (!user) {
        return res.json({ success: false, message: "Email or password is incorrect" });
    }

    const isCorrectPassword = await UserPassword.compare(email, password);
    if (!isCorrectPassword) {
        return res.json({ success: false, message: "Email or password is incorrect" });
    }

    await UserMetadata.update(
        { last_login_date: formatISO(Date.now()), last_ipv4: req.ip },
        { where: { user_id: user.user_id } }
    );

    req.session.user_id = user.user_id;
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
