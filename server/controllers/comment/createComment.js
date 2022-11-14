//import crypto library for generating UUID
const crypto = require('crypto');
const pool = require("../../lib/dbConnect.js");

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
        [commentID, commentData.postID, commentData.userID, commentData.commentText, commentData.commentFile, commentData.createdAt]
    );

    if (!newComment) {
        let err = new Error(`Error: SQL query failed.`);
        console.log(err);
        return err;
    }

    //Post created
    return {
        comment_id: commentID,
        post_id: commentData.postID,
        user_id: commentData.userID,
        comment_text: commentData.commentText,
        comment_file: commentData.commentFile,
        created_at: commentData.createdAt
    };
}

module.exports = createComment;
