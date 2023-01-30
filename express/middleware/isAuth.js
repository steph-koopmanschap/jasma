async function isAuth(req, res, next) {
    if (req.session.user_id) {
        return next();
    } else {
        res.json({ success: false, message: "You are not logged in. Login first to continue." });
    }
}

module.exports = isAuth;
