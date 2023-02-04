const db = require("../db/connections/jasmaAdmin");
const { Post, Hashtag, PostHashtag, UserBookmarks } = db.models;

async function createPost(req, res) {
    const { text_content, hashtags, file, fileName } = req.body;
    const { user_id, username } = req.session;
    //Transform raw hashtags string to array
    const hashtagsArray = hashtags.split(",");

    const t = await db.transaction();
    try {
        const createdPost = await Post.create({
            user_id: user_id,
            username: username,
            text_content: text_content,
            file_url: `${process.env.HOSTNAME}:${process.env.PORT}/media/posts/${fileName}`
            //file_url: `http://localhost:5000/media/posts/${fileName}`
        });
        const post_id = createdPost.dataValues.post_id;
        for (let i = 0; i < hashtagsArray.length; i++) {
            //Check if the hashtag already exists.
            const resHashtag = await db.query(`SELECT hashtag FROM hashtags WHERE hashtag = ?`, {
                replacements: [hashtagsArray[i]]
            });
            //Hashtag does not exist.
            if (resHashtag[0].length === 0) {
                await Hashtag.create({ hashtag: hashtagsArray[i] });
            }
            await PostHashtag.create({ hashtag: hashtagsArray[i], post_id: post_id });
        }
    } catch (err) {
        await t.rollback();
        return res.json({ success: false, message: err.message });
    }

    //TODO Also return created post
    return res.json({ success: true });
}

async function deletePost(req, res) {
    const { postID } = req.params;
    const deletedPost = await Post.destroy({
        where: {
            post_id: postID
        }
    });
    
    return res.json({ success: true, post_id: postID });
}

//Not tested yet
async function editPost(req, res) {
    const { postData } = req.body;
    const updatedPost = await Post.update(postData, {
        where: 
            { post_id: postData.post_id } 
        });
    
    return res.json({ success: true, postData: postData });
}

async function getUserPosts(req, res) {
    const { user_id, limit } = req.query;
    let posts = [];
    try {
        posts = await Post.findByUserId(user_id, limit);
    }
    catch(e) {
        console.log(e);
        return res.json({ success: false, message: "user_id is undefined. Can't retrieve posts." } );
    }

    return res.json({ success: true, posts: posts });
}

async function getLatestPosts(req, res) {
    const { limit } = req.query;
    const posts = await Post.getLatest(limit);

    return res.json({ success: true, posts: posts });
}

async function getNewsFeed(req, res) {
    const { user_id } = req.session;
    const posts = await Post.getNewsFeed(user_id);

    return res.json({ success: true, posts: posts });
}

async function addPostBookmark(req, res) {
    const { post_id } = req.body;
    const { user_id } = req.session;
    const createdBookmark = await UserBookmarks.create({
        user_id: user_id,
        post_id: post_id
    });
    
    return res.json({ success: true, message: "Bookmark added." });
}

async function removePostBookmark(req, res) {
    const { post_id } = req.params;
    const { user_id } = req.session;
    const removedBookmark = await UserBookmarks.destroy({
        where: {
            user_id: user_id,
            post_id: post_id
        }
    });

    return res.json({ success: true, message: "Bookmark removed." });
}

async function getBookmarkedPosts(req, res) {
    const { user_id } = req.session;

    const bookmarkedPosts = await Post.getBookmarkedPosts(user_id);

    return res.json({ success: true, posts: bookmarkedPosts });
}

module.exports = {
    createPost,
    deletePost,
    editPost,
    getUserPosts,
    getLatestPosts,
    getNewsFeed,
    addPostBookmark,
    removePostBookmark,
    getBookmarkedPosts
};
