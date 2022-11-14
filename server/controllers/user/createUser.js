//import crypto library for generating UUID
const crypto = require('crypto');
//import the bcrypt library for hashing functions
const bcrypt = require("bcrypt"); 
//import connection for PostGreSQL
const pool = require("../../db/dbConnect.js");
//Import utility functions
const formatDateToStr = require("../../utils/formatDateToStr.js");
const getUserID = require("./getUserID.js");
const checkEmailExists = require("./checkEmailExists.js");

//Create a new user
//returns null if user already exists
//returns true if user is created
//returns error if error
async function createUser(userData) {
    //First check if the user already exists
    let existing_userID = await getUserID(userData.username);
    if (existing_userID !== null) {
        return null;
    }
    //Check if e-mail is already in use.
    let isEmailExist = await checkEmailExists(userData.email);
    if (isEmailExist === true) {
        return null;
    }
    //User can be created
    else 
    {
        //First hash the password with bcrypt before creating user
        //Only the hash is stored in the database. The plaintext password is never stored.
        try 
        {
            // generate the salt. The default salt rounds is 10.
            const salt = await bcrypt.genSalt(10);
            // create the hash (convert plaintext password to a hash)
            const hashedPassword = await bcrypt.hash(userData.password, salt);
            // Replace the plaintext password of the user with their hashed version.
            userData.password = hashedPassword;
        } 
        catch (error) 
        {
            console.log(error);
            return error;
        }
        //Create the unique user id (can never be changed)
        const userID = crypto.randomUUID();
        //Set the user account creation date (last login date will be same as creation date)
        const creation_date = formatDateToStr(new Date(), "YYYY-MM-DD", "-");

        //Add the new user to the database
        //Add core user data
        let core = await pool.query(
            `
            INSERT INTO users(user_id, username, email, user_password)
            VALUES (
                $1::uuid,
                $2,
                $3,
                $4
            )
            `,
            [userID, userData.username, userData.email, userData.password]
        );

        //Add user info (nothing added yet during account creation)
        //NOTE: User can voluntarily add more info to their profile after account creation
        let info = await pool.query(
            `
            INSERT INTO users_info(user_id)
            VALUES (
                $1::uuid,
            )
            `,
            [userID]
        );

        //Add user metadata
        let metadata = await pool.query(
            `
            INSERT INTO users_metadata(user_id, last_login_date, account_creation_date)
            VALUES (
                $1::uuid,
                $2
                $3::date,
                $4::date
                $5
            )
            `,
            [userID, 'normal', creation_date, creation_date, false, userData.ip]
        );

        //Add user preferences
        let preferences = await pool.query(
            `
            INSERT INTO users_preferences(user_id, email_notifications)
            VALUES (
                $1::uuid,
                $2
            )
            `,
            [userID, true]
        );
    }
    //New user account created
    return true;
}

module.exports = createUser;
