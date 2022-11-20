//import crypto library for generating UUID
const crypto = require('crypto');
const pool = require("../../db/dbConnect.js");

//Create a new comment on a post

//returns the newly created comment
async function createComment(commentData) {

    const commentID = crypto.randomUUID();

    //created_at and last_edited_at will be the same for newly created posts
    let newComment = await pool.query(
        `
        INSERT INTO comments(comment_id, post_id, user_id, comment_text, comment_file, created_at)
        VALUES (
            $1::uuid,
            $2::uuid,
            $3::uuid,
            $4,
            $5,
            $6
        )
        `,
        [commentID, commentData.post_id, commentData.user_id, commentData.comment_text, commentData.comment_file, commentData.created_at]
    );

    if (!newComment) {
        let err = new Error(`Error: SQL query failed.`);
        console.log(err);
        return err;
    }

    //add commentID to the comment data
    commentData.comment_id = commentID;
    //Post created
    return commentData;
}

module.exports = createComment;
