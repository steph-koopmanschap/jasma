const db = require("../db/connections/jasmaAdmin");
const { Comment } = db.models;

async function getComments(req, res) {
    const { post_id, limit } = req.query;
    const comments = await Comment.getComments(post_id, limit);

    if (comments.length === 0) {
        return res.json({ success: false, message: "No comments" });
    }

    return res.json({ success: true, comments: comments });
}

module.exports = {
    getComments
};
