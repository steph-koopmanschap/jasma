const pool = require("../../db/dbConnect.js");

//This returns a single post retrieved by postID
//Use this when postID is already known
async function getPost(postID) {
    let post = await pool.query(
        `
        SELECT user_id, text_content, file_content, created_at, last_edit_at
        FROM posts
        WHERE post_id = $1::uuid
        `,
        [postID]
    );

    if (!post) {
        let err = new Error(`Error: SQL query failed.`);
        console.log(err);
        return err;
    }

    //Get all the hashtags for the post
    let hashtags = await pool.query(
        `
        SELECT hashtag
        FROM posts_hashtags
        WHERE post_id = $1
        `,
        [postID]
    );

    let hashtagsArray = [];
    //turn the hashtags object into an array
    for (let j = 0; j < hashtags.rows.length; j++) 
    {
        hashtagsArray.push(hashtags.rows[j].hashtag);
    }

    //Add the hashtags to the post as an array
    post.rows[0].hashtags = hashtagsArray;
    //Add postID to post
    post.rows[0].post_id = postID;

    return post.rows[0];
}

module.exports = getPost;
