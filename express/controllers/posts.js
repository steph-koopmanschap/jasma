const db = require("../db/connections/jasmaAdmin");
const { Post } = db.models;

async function getLatestPosts(req, res) {
    const { limit } = req.query;
    const posts = await Post.getLatest(limit);

    return res.json({ success: true, posts: posts });
}

module.exports = {
    getLatestPosts
};