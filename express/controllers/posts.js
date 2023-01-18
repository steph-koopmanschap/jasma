const db = require("../db/connections/jasmaAdmin");
const { Post } = db.models;

async function getUserPosts(req, res) {
    const { user_id, limit } = req.query;
    const posts = await Post.findByUserId(user_id, limit);

    return res.json({ success: true, posts: posts });
}

async function getLatestPosts(req, res) {
    const { limit } = req.query;
    const posts = await Post.getLatest(limit);

    return res.json({ success: true, posts: posts });
}

module.exports = {
    getUserPosts,
    getLatestPosts
};