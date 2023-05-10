//Check if the user is both logged in and an admin
async function isAuthIsAdmin(req, res, next) {
    if (req.session.user_id && req.session.role === "admin") {
        return next();
    } else {
        res.json({ success: false, message: "You are not logged in. Login first to continue." });
    }
}

module.exports = isAuthIsAdmin;
