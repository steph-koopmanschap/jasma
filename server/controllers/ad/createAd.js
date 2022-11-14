//import crypto library for generating UUID
const crypto = require('crypto');
const pool = require("../../db/dbConnect.js");

// @TODO: Keywords should be an array not a single value
// Link to the hashtags table???

//returns the newly created ad
async function createAd(adData) {

    const adID = crypto.randomUUID();

    //created_at and last_edited_at will be the same for newly created posts
    let newAd = await pool.query(
        `
        INSERT INTO ads(ad_id, user_id, ad_file, ad_url, created_at, expires_at)
        VALUES (
            $1::uuid,
            $2::uuid,
            $3,
            $4,
            $5,
            $6
        )
        `,
        [adID, adData.userID, adData.adFile, adData.adURL, adData.createdAt, adData.expiresAt]
    );

    let adPreferences = await pool.query(
        `
        INSERT INTO ads_preferences(ad_id, age_start, age_end, country, city, keyword)
        VALUES (
            $1::uuid,
            $2,
            $3,
            $4,
            $5,
            $6
        )
        `,
        [adID, adData.ageStart, adData.ageEnd, adData.country, adData.city, adData.keywords]
    );

    if (!newAd || !adPreferences) {
        let err = new Error(`Error: SQL query failed.`);
        console.log(err);
        return err;
    }

    //ad created
    return {
        ad_id: adID,
        user_id: adData.userID,
        ad_file: addData.adFile,
        ad_url: addData.adURL,
        created_at: addData.createdAt,
        expires_at: addData.expiresAt,
        age_start: adData.ageStart,
        age_end: adData.ageEnd,
        country: adData.country,
        city: adData.city,
        //this should be an array of keywords
        keywords: adData.keywords
        
    };
}

module.exports = createAd;
