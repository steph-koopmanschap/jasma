const formatDateToStr = require("../../utils/formatDateToStr.js");
const pool = require("../../lib/dbConnect.js");

// @TODO: THIS IS NOT DONE YET

//Edit a post of a user
async function editPost(postData) {
    const lastEdit = formatDateToStr(new Date(), "YYYY-MM-DD", "-");

    //update text
    if ("textContent" in postData)
    {
        let updatePost = await pool.query(
            `
            UPDATE posts
            SET text_content $1
            SET last_edit_at $2
            WHERE post_id = $3
            `,
            [postData.textContent, lastEdit, postData.postID]
        );

    }

    //update file
    if ("fileContent" in postData)
    {
        let updatePost = await pool.query(
            `
            UPDATE posts
            SET file_content $1
            SET last_edit_at $2
            WHERE post_id = $3
            `,
            [postData.fileContent, lastEdit, postData.postID]
        );
    }

    if (!updatePost) {
        let err = new Error(`Error: SQL query failed.`);
        console.log(err);
        return err;
    }

    //post updated
    return true;
}

module.exports = editPost;
