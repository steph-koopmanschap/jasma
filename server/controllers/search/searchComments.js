const pool = require("../../db/dbConnect.js");

//This returns a list of postIDs that contain the provided hashtags
//hashtags is a string of hashtags seperated by spaces (" ")
//returns an array of PostIDs
async function searchComments(text, limit) {
    let textPattern = `%${text}%`
    let commentIDsArray = [];
    
    //Get all the postIDs containing the text    
    let commentIDs = await pool.query(
        `
        SELECT comment_id
        FROM comments
        WHERE comment_text LIKE $1
        LIMIT $2
        `,
        [textPattern, limit]
    );

    //turn the commentIDs objects into array
    for (let j = 0; j < commentIDs.rows.length; j++) 
    {
        commentIDsArray.push(commentIDs.rows[j].comment_id);
    }
    
    //remove duplicate postsIDs
    //Is this needed??????
    commentIDsArray = commentIDsArray.filter((commentID, index) => postsIDsArray.indexOf(commentID) === index);

    if (!postsIDs) {
        let err = new Error(`Error: SQL query failed.`);
        console.log(err);
        return err;
    }

    return commentIDsArray;
}

module.exports = searchComments;
