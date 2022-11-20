const pool = require("../../db/dbConnect.js");

//NOT YET FINISHED
// @TODO: Retrieve ad preferences too
//          Use inner join?

//Retrieve all the ads of a particular user
async function getAdsOfUser(userID) {
    let ad = await pool.query(
        `
        SELECT *
        FROM ads
        WHERE user_id = $1
        `,
        [userID]);

    if (!ad) {
        let err = new Error(`Error: SQL query failed.`);
        console.log(err);
        return err;
    }
    //ad deleted
    return ad.rows;
}

module.exports = getAdsOfUser;
