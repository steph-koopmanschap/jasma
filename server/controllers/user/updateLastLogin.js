const pool = require("../../db/dbConnect.js");

//This function updates the last login date and the last ip4 of the user
//Ideally this function is called whenever the user logs in.
//return true if last login date updated
async function updateLastLogin(userID, ip) {
    const newLoginDate = formatDateToStr(new Date(), "YYYY-MM-DD", "-");

    let loginDate = await pool.query(
        `
        UPDATE users_metadata
        SET last_login_date = $1::date
        SET last_ip4 = $2
        WHERE user_id = $3
        `,
        [newLoginDate, ip, userID]
    );

    if (!result) {
        let err = new Error(`Error: SQL query failed.`);
        console.log(err);
        return err;
    }

    return true;
}

module.exports = updateLastLogin;
