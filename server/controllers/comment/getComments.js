const pool = require("../../db/dbConnect.js");

//Get all comments from a particular post
async function getComments(postID, limit = 1) {
    let comments = await pool.query(
        `
        SELECT comment_id, user_id, comment_text, comment_file, created_at
        FROM comments
        WHERE post_id = $1
        ORDER BY created_at DESC NULLS LAST
        LIMIT $2
        `,
        [postID, limit]
    );

    if (!comments) {
        let err = new Error(`Error: SQL query failed.`);
        console.log(err);
        return err;
    }

    //Might give problems to return object instead of array???
    // if (limit === 1) {
    //     return comments.rows[0];
    // }
    return comments.rows;
}

module.exports = getComments;
