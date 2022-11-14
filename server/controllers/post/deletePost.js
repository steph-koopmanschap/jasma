const pool = require("../../db/dbConnect.js");

//Delete a post
async function deletePost(postID) {
    let result = await pool.query(
        `
        DELETE FROM posts
        WHERE post_id = $1
        `,
        [postID]);

    if (!result) {
        let err = new Error(`Error: SQL query failed.`);
        console.log(err);
        return err;
    }
    //post deleted
    return postID;
}

module.exports = deletePost;
