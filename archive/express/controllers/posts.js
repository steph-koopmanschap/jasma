const db = require("../db/connections/jasmaAdmin");
const { deleteFile } = require("../utils/deleteFile.js");
const { Post, Hashtag, PostHashtag, UserBookmarkedPosts } = db.models;

async function createPost(req, res) {
    const { text_content, hashtags, file, fileName } = req.body;
    const { user_id, username } = req.session;

    const t = await db.transaction();
    try {
        //Make sure hashtags is an array or else hashtags.split won't work.
        if (Array.isArray(hashtags) === false) {
            throw new Error('hashtags is not an array');
        }
        //Transform raw hashtags string to array
        const hashtagsArray = hashtags.split(",");

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
            const HashtagAlreadyExists = await Hashtag.checkHashtagAlreadyExists(hashtagsArray[i]);

            //Hashtag does not exist.
            if (HashtagAlreadyExists === false) {
                //Add the hashtag to the Database
                await Hashtag.create({ hashtag: hashtagsArray[i] });
            }
            await PostHashtag.create({ hashtag: hashtagsArray[i], post_id: post_id });
        }
    } catch (err) {
        console.error(err.message);
        await t.rollback();
        return res.json({ success: false, message: err.message });
    }

    //TODO Also return created post
    return res.json({ success: true });
}

async function deletePost(req, res) {
    const { postID } = req.params;
    const resFileUrl = await db.query(`SELECT file_url FROM posts WHERE post_id = ?`, {
        replacements: [postID]
    });

    //Delete the file accociated to the post, only if there is a file accociated with it.
    if (//resFileUrl[0].length !== 0 ||
        resFileUrl[0][0].file_url !== `${process.env.HOSTNAME}:${process.env.PORT}/media/posts/undefined`)
    {
        deleteFile(resFileUrl[0][0].file_url);
    }

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
        return res.json({ success: false, message: "user_id is undefined. Could not retrieve posts" } );
    }

    return res.json({ success: true, posts: posts });
}

async function getSinglePost(req, res) {
    const { post_id } = req.params;
    
    try {
        const post = await Post.findByPostId(post_id);
        if (!post || post.length === 0) {
            //status 404
            return res.json({ success: false, message: "Could not find post.", posts: [] }); 
        }
        //status 200
        return res.json({ success: true, posts: post }); 
    }
    catch(e) {
        console.error(e);
        //status 500
        return res.json({ success: false, message: "Failed to retrieve post.", posts: [] }); 
    }   
}

//Get mulitple specific posts by passing in an array of post_ids
//Using a POST request, instead of GET (Advised by ChatGPT)
//Because the array of post_ids might be too long to put into URL query parameters.
async function getMultiplePosts(req, res) {
    const { post_ids } = req.body;

    if (post_ids === undefined || post_ids?.length === 0) {
        return res.json({ success: false, message: "post_ids is undefined or empty. Could not retrieve posts.", posts: [] } );
    }

    let posts = null;
    try {
        posts = await Post.findByPostIds(post_ids);
    }
    catch(e) {
        console.error(e);
        return res.json({ success: false, message: "post_ids is undefined. Failed to retrieve posts." } );
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
    const createdBookmark = await UserBookmarkedPosts.create({
        user_id: user_id,
        post_id: post_id
    });
    
    return res.json({ success: true, message: "Bookmark added." });
}

async function removePostBookmark(req, res) {
    const { post_id } = req.params;
    const { user_id } = req.session;
    const removedBookmark = await UserBookmarkedPosts.destroy({
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
    getSinglePost,
    getMultiplePosts,
    getLatestPosts,
    getNewsFeed,
    addPostBookmark,
    removePostBookmark,
    getBookmarkedPosts
};
