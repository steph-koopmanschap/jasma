const db = require("../db/connections/jasmaAdmin");
const { Comment } = db.models;

async function createComment(req, res) {
    const { post_id, comment_text, file } = req.body;
    const { user_id, username } = req.session;
    
    try {
        const createdComment = await Comment.create({ post_id: post_id, user_id: user_id, username: username, comment_text: comment_text, file_url: "" });
    }
    catch (err) {
        return res.json({ success: false, message: err.message });
    }
    
    //TODO: Send back the created comment.
    return res.json({ success: true });
}

async function getComments(req, res) {
    const { post_id, limit } = req.query;
    const commentData = await Comment.getComments(post_id, limit);

    if (commentData.comments.length === 0) {
        return res.json({ success: false, message: "No comments" });
    }

    return res.json({ success: true, comments: commentData.comments, commentCount:  commentData.commentCount });
}

module.exports = {
    createComment,
    getComments
};
