const pool = require("../../db/dbConnect.js");

//Delete a post
async function deleteAd(adID) {
    let result = await pool.query(
        `
        DELETE FROM ads
        WHERE ad_id = $1
        `,
        [adID]);

    if (!result) {
        let err = new Error(`Error: SQL query failed.`);
        console.log(err);
        return err;
    }
    //post deleted
    return adID;
}

module.exports = deleteAd;
