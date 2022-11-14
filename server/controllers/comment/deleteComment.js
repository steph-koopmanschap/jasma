const pool = require("../../db/dbConnect.js");

//Delete a post
async function deleteComment(commentID) {
    let result = await pool.query(
        `
        DELETE FROM comments
        WHERE comment_id = $1
        `,
        [commentID]);

    if (!result) {
        let err = new Error(`Error: SQL query failed.`);
        console.log(err);
        return err;
    }
    //post deleted
    return commentID;
}

module.exports = deleteComment;
