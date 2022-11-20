const pool = require("../../db/dbConnect.js");

//This returns a list of postIDs that contain the provided text
//returns an array of PostIDs
async function searchPostsText(text, limit) {

    let textPattern = `%${text}%`
    let postsIDsArray = [];
    
    //Get all the postIDs containing the text    
    let postsIDs = await pool.query(
        `
        SELECT post_id
        FROM posts
        WHERE text_content LIKE $1
        LIMIT $2
        `,
        [textPattern, limit]
    );

    //turn the postIDs objects into array
    for (let j = 0; j < postsIDs.rows.length; j++) 
    {
        postsIDsArray.push(postsIDs.rows[j].post_id);
    }
    
    //remove duplicate postsIDs
    //Is this needed??????
    postsIDsArray = postsIDsArray.filter((postID, index) => postsIDsArray.indexOf(postID) === index);

    if (!postsIDs) {
        let err = new Error(`Error: SQL query failed.`);
        console.log(err);
        return err;
    }

    return postsIDsArray;
}

module.exports = searchPostsText;
