const pool = require("../../lib/dbConnect.js");

//This function assumes the userID is not known yet, but username is.
//returns null if user not found
//returns uuid of user if found
//returns error if error
async function getUserID(username) {
    let result = await pool.query(
        `
        SELECT user_id
        FROM users
        WHERE username = $1
        `,
        [username]
    );

    if (!result) {
        let err = new Error(`Error: SQL query failed.`);
        console.log(err);
        return err;
    }
    //User not found
    if (!result.rows || !result.rows.length) {
        console.log(`user: ${username} not found in database.`);
        return null;
    }

    return result.rows[0].user_id;
}

module.exports = getUserID;
