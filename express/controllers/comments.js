const db = require("../db/connections/jasmaAdmin");
const { Comment } = db.models;

async function getComments(req, res) {
    const { post_id, limit } = req.query;
    const commentData = await Comment.getComments(post_id, limit);

    if (commentData.comments.length === 0) {
        return res.json({ success: false, message: "No comments" });
    }

    return res.json({ success: true, comments: commentData.comments, commentCount:  commentData.commentCount });
}

module.exports = {
    getComments
};
