const pool = require("../../db/dbConnect.js");

//Update the users_info table
async function updateUserInfo(userData) {

    if ("profilePic" in userData)
    {
        let updatedInfo = await pool.query(
            `
            UPDATE users_info
            SET profile_pic = $1
            WHERE user_id = $2
            `,
            [userData.profilePic, userData.userID]
        );
    }

    if ("givenName" in userData)
    {
        let updatedInfo = await pool.query(
            `
            UPDATE users_info
            SET given_name = $1
            WHERE user_id = $2
            `,
            [userData.givenName, userData.userID]
        );
    }

    if ("lastName" in userData)
    {
        let updatedInfo = await pool.query(
            `
            UPDATE users_info
            SET lastName = $1
            WHERE user_id = $2
            `,
            [userData.lastName, userData.userID]
        );
    }

    if ("bio" in userData)
    {
        let updatedInfo = await pool.query(
            `
            UPDATE users_info
            SET bio = $1
            WHERE user_id = $2
            `,
            [userData.bio, userData.userID]
        );
    }

    if ("dateOfBirth" in userData)
    {
        let updatedInfo = await pool.query(
            `
            UPDATE users_info
            SET date_of_birth = $1
            WHERE user_id = $2
            `,
            [userData.dateOfBirth, userData.userID]
        );
    }

    if ("country" in userData)
    {
        let updatedInfo = await pool.query(
            `
            UPDATE users_info
            SET country = $1
            WHERE user_id = $2
            `,
            [userData.country, userData.userID]
        );
    }

    if ("city" in userData)
    {
        let updatedInfo = await pool.query(
            `
            UPDATE users_info
            SET city = $1
            WHERE user_id = $2
            `,
            [userData.city, userData.userID]
        );
    }

    if ("website" in userData)
    {
        let updatedInfo = await pool.query(
            `
            UPDATE users_info
            SET website = $1
            WHERE user_id = $2
            `,
            [userData.website, userData.userID]
        );
    }

    if (!updatePost) {
        let err = new Error(`Error: SQL query failed.`);
        console.log(err);
        return err;
    }

    //user info updated
    return true;
}

module.exports = updateUserInfo;
