const pool = require("../../db/dbConnect.js");

//Checks if the given email already exists in the database
//Returns true if yes, returns false if not.
async function checkEmailExists(email) {
    let result = await pool.query(
        `
        SELECT email
        FROM users
        WHERE email = $1
        `,
        [email]
    );

    if (!result) {
        let err = new Error(`Error: SQL query failed.`);
        console.log(err);
        return err;
    }
    //e-mail not found
    if  (!result.rows || !result.rows.length) {
        return false;
    }
    //e-mail found
    return true;
}

module.exports = checkEmailExists;
