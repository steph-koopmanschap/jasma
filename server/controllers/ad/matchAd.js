const pool = require("../../db/dbConnect.js");

//NOT YET FINISHED

// This function should select which ad to retrieve
// based on keywords, location, user's info etc.
// Or in other words match the perfect ad for the appropriate user/demographic

//Retrieve all the ads of a particular user
async function matchAd() {
    let ad = await pool.query(
        `

        `,
        []);

    if (!ad) {
        let err = new Error(`Error: SQL query failed.`);
        console.log(err);
        return err;
    }


    return ads.rows;
}

module.exports = matchAd;
