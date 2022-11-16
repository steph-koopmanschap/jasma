const pool = require("../../db/dbConnect.js");

//This returns a list of postIDs that contain the provided hashtags
//hashtags is a string array
async function searchPosts(hashtags, limit) {
    const postsIDsArray = [];
    //Get all the postIDs containing the hashtags

    let postsIDs;
    for (let i = 0; i < hashtags.length; i++)
    {
        postsIDs = await pool.query(
            `
            SELECT post_id
            FROM posts_hashtags
            WHERE hashtag = $1
            LIMIT $2
            `,
            [hashtags[i], limit]
        );

        postsIDsArray = postsIDsArray.concat(postsIDs.rows)
    }

    if (!postsIDs) {
        let err = new Error(`Error: SQL query failed.`);
        console.log(err);
        return err;
    }

    return postsIDsArray;
}

module.exports = searchPosts;
