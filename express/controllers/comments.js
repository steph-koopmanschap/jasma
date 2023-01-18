const db = require("../db/connections/jasmaAdmin");
const { Comment } = db.models;

async function getComments(req, res) {
    const { post_id, limit } = req.query;
    const comments = await Comment.getComments(post_id, limit);

    console.log("comments");
    console.log(comments);

    if (comments.length === 0) {
        return res.json({ success: false, message: "No comments" });
    }

    return res.json({ success: true, commments: comments });
}

module.exports = {
    getComments
};
