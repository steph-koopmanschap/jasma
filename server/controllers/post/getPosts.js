const pool = require("../../db/dbConnect.js");

// @TODO: STILL NEED TO GET HASHTAGS!?

//Get the latest post(s) of a user
//By default only 1 post is retrieved
async function getPosts(userID, limit = 1) {
    let posts = await pool.query(
        `
        SELECT post_id, text_content, file_content, created_at, last_edited_at
        FROM posts
        WHERE user_id = $1
        ORDER BY created_at DESC NULLS LAST
        LIMIT $2
        `,
        [userID, limit]
    );

    if (!posts) {
        let err = new Error(`Error: SQL query failed.`);
        console.log(err);
        return err;
    }

    //Get all the hashtags for each post
    //not sure yet if this works??
    for (let i = 0; i < posts.rows.length; i++)
    {
        let hashtags = await pool.query(
            `
            SELECT hashtag
            FROM posts_hashtags
            WHERE post_id = $1
            `,
            [posts.rows[i].post_id]
        );

        //Add the hashtags to each post as an array
        posts.rows[i].hashtags = hashtags.rows;
    }

    //Might give problems to return object instead of array???
    // if (limit === 1) {
    //     return posts.rows[0];
    // }
    return posts.rows;
}

module.exports = getPosts;
