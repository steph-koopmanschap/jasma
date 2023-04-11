const db = require("../db/connections/jasmaAdmin");
const { User, UserPassword, UserMetadata } = db.models;
const { formatISO } = require("date-fns");

async function register(req, res) {
    const { username, email, password } = req.body;
    const usernameExists = await User.getByUsername(username);
    if (usernameExists) {
        return res.json({ success: false, message: "Username already in use." });
    }

    const emailExists = await User.getByEmail(email);
    if (emailExists) {
        return res.json({ success: false, message: "Email already in use." });
    }

    const t = await db.transaction();
    try {
        await User.create({ username, email });
        await UserPassword.create({ user_email: email, user_password: password });
    } catch (err) {
        await t.rollback();
    }

    res.json({ success: true, message: `New user with username: ${username} registered.` });
}

async function login(req, res) {
    const { email, password } = req.body;

    const user = await User.getByEmail(email);
    if (!user) {
        return res.json({ success: false, message: "Email or password is incorrect." });
    }

    const isCorrectPassword = await UserPassword.compare(email, password);
    if (!isCorrectPassword) {
        return res.json({ success: false, message: "Email or password is incorrect." });
    }

    const updatedMetadata = await UserMetadata.update(
        { last_login_date: formatISO(Date.now(), { representation: 'date' }), last_ipv4: req.ip },
        { where: { user_id: user.user_id } }
    );

    //Get the user role
    const resMetadata = await UserMetadata.getById(user.user_id);

    //Attach the info the session storage
    req.session.user_id = user.user_id;
    req.session.username = user.username;
    req.session.email = user.email;
    req.session.role = resMetadata.user_role;
    res.json({ success: true, user, message: "user logged in." });
}

async function logout(req, res) {
    req.session.destroy((err) => {
        if (err) {
            res.json({ success: false, message: "Unable to logout." });
        } else {
            res.clearCookie("connect.sid", { path: "/" });
            res.json({ success: true, message: "Logged out." });
        }
    });
}

async function checkAuth(req, res) {
    if (req.session && req.session.user_id) {
        res.json({ isAuth: true });
    } else {
        res.json({ isAuth: false });
    }
}

//Mainly used for moderator and administrator auth
async function checkAuthUserRole(req, res) {
    if (req.session && req.session.user_id && req.session.role) {
        return res.json({
            "mod": (req.session.role === 'mod'),
            "admin": (req.session.role === 'admin') 
            //"guest":
            //"normal": 
        })
    }   
}

async function changePassword(req, res) {
    const { newPassword } = req.body;
    const email = req.session.email;

    const hashedPassword = await UserPassword.hashPassword(newPassword);

    const update = await UserPassword.update(
        { user_password: hashedPassword },
        { where: { user_email: email }}
    );

    return res.json({ success: true, message: "Password changed." });
}

module.exports = { checkAuth, checkAuthUserRole, register, login, logout, changePassword };
