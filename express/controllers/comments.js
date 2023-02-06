const db = require("../db/connections/jasmaAdmin");
const { deleteFile } = require("../utils/deleteFile.js");
const { Comment } = db.models;

async function createComment(req, res) {
    const { post_id, comment_text, file, fileName } = req.body;
    const { user_id, username } = req.session;
    
    try {
        const createdComment = await Comment.create({ 
            post_id: post_id, 
            user_id: user_id, 
            username: username, 
            comment_text: comment_text, 
            file_url: `${process.env.HOSTNAME}:${process.env.PORT}/media/comments/${fileName}`
            //file_url: `http://localhost:5000/media/comments/${fileName}` 
        });
    }
    catch (err) {
        return res.json({ success: false, message: err.message });
    }
    
    //TODO: Send back the created comment.
    return res.json({ success: true });
}

async function deleteComment(req, res) {
    const { commentID } = req.params;
    const resFileUrl = await db.query(`SELECT file_url FROM comments WHERE comment_id = ?`, {
        replacements: [commentID]
    });
    //Delete the file accociated to the comment, only if there is a file accociated with it.
    if (//resFileUrl[0].length !== 0 ||
        resFileUrl[0][0].file_url !== `${process.env.HOSTNAME}:${process.env.PORT}/media/posts/undefined`)
    {
        deleteFile(resFileUrl[0][0].file_url);
    }
    
    const deletedComment = await Comment.destroy({
        where: {
            comment_id: commentID
        }
    });
    
    return res.json({ success: true, comment_id: commentID });
}

//Not tested yet
async function editComment(req, res) {
    const { commentData } = req.body;
    const updatedComment = await Comment.update(commentData, {
        where: 
            { comment_id: commentData.comment_id } 
        });
    
    return res.json({ success: true, commentData: commentData });
}

async function getComments(req, res) {
    const { post_id, limit } = req.query;
    const commentData = await Comment.getComments(post_id, limit);

    if (commentData.comments.length === 0) {
        return res.json({ success: false, message: "No comments" });
    }

    return res.json({ success: true, comments: commentData.comments, commentCount:  commentData.commentCount });
}

module.exports = {
    createComment,
    deleteComment,
    editComment,
    getComments
};
