const pool = require("../../db/dbConnect.js");

//This returns a list of postIDs that contain the provided hashtags
//hashtags is a string of hashtags seperated by spaces (" ")
//returns an array of PostIDs
async function searchPostsHashtags(hashtags, limit) {
    //Convert string to array
    hashtags = hashtags.split(" ");
    let postsIDsArray = [];
    
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

        //turn the postIDs objects into array
        for (let j = 0; j < postsIDs.rows.length; j++) 
        {
            postsIDsArray.push(postsIDs.rows[j].post_id);
        }
    }
    
    //remove duplicate postsIDs
    postsIDsArray = postsIDsArray.filter((postID, index) => postsIDsArray.indexOf(postID) === index);

    if (!postsIDs) {
        let err = new Error(`Error: SQL query failed.`);
        console.log(err);
        return err;
    }

    return postsIDsArray;
}

module.exports = searchPostsHashtags;
