const pool = require("../../db/dbConnect.js");

//NOT YET FINISHED
// @TODO: Retrieve ad preferences too
//          Use inner join?

//Retrieve an ad 
async function getAd(adID) {
    let ad = await pool.query(
        `
        SELECT *
        FROM ads
        WHERE ad_id = $1
        `,
        [adID]);

    if (!ad) {
        let err = new Error(`Error: SQL query failed.`);
        console.log(err);
        return err;
    }
    //ad deleted
    return ad.rows[0];
}

module.exports = getAd;
