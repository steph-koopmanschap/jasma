const db = require("../db/connections/jasmaAdmin");
const { User, Ad, AdTargetingPreferences } = db.models;

async function createAd(req, res) {
    const { advertData } = req.session;
    const { user_id } = req.session;
    
    //1.

    return res.json({ success: false, message: "This function is not complete yet." });
}
