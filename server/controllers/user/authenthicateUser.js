//import the bcrypt library for hashing functions
const bcrypt = require("bcrypt"); 
//import connection for PostGreSQL
const pool = require("../../db/dbConnect.js");

//Returns user_id, username, and email if password matches, 
//returns false if not, 
//returns null if user not found 
//returns error if error
async function authenthicateUser(email, password) {
    let result = await pool.query(
        `
        SELECT user_id, username, user_password
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
    //User not found
    if (!result.rows || !result.rows.length) {
        console.log(`user with email: ${email} not found in database.`);
        return null;
    }
    // Use bycrypt to hash the plaintext password and see if it matches with the hash in the database
    // First argument is the plainttext password, the 2nd argument is the hash of that password.
    try 
    {
        //User has wrong credentials
        const isPasswdEqual = await bcrypt.compare(password, result.rows[0].user_password);
        if (isPasswdEqual === false) {
            return false;
        }

        //User is authenthicated
        return {
            user_id: result.rows[0].user_id,
            username: result.rows[0].username,
            email: email,
        };
    }
    catch (error)
    {
        console.log(error);
        return error;
    }
}

module.exports = authenthicateUser;
