const pool = require("../../db/dbConnect.js");

//This returns a list of userID and usernames whose username match or closely match the provided keyword
//keyword is a string
//returns an array of objects each containting user_id and username
async function searchUsers(keywords, limit) {
    //Convert string to array
    keywords = keyword.split(" ");
    //Only the first keyword will be used, the rest will be discarded
    let keyword = keywords[0];
    //keyword pattern for SQL search matching
    let keywordPattern = `%${keyword}%`;
    
    //Get all the postIDs containing the hashtags
    let users = await pool.query(
        `
        SELECT user_id, username
        FROM users
        WHERE username LIKE $1
        LIMIT $2
        `,
        [keywordPattern, limit]
    );

    if (!users) {
        let err = new Error(`Error: SQL query failed.`);
        console.log(err);
        return err;
    }

    return users.rows;
}

module.exports = searchUsers;
