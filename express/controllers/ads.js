const db = require("../db/connections/jasmaAdmin");
const { User, Ad, AdTargetingPreferences } = db.models;

async function createAd(req, res) {
    const { advertData } = req.body;
    const { user_id } = req.session;
    
    //1.

    return res.json({ success: false, message: "This function is not complete yet." });
}

async function deleteAd(req, res) {
    const { adID } = req.params;
    const { user_id } = req.session;
    
    //1.

    return res.json({ success: false, message: "This function is not complete yet." });
}

async function editAd(req, res) {
    const { advertData } = req.body;
    const { user_id } = req.session;
    
    //1.

    return res.json({ success: false, message: "This function is not complete yet." });
}

async function getAd(req, res) {
    const { adID } = req.params;
    const { user_id } = req.session;
    
    //1.

    return res.json({ success: false, message: "This function is not complete yet." });
}

async function getAds(req, res) {
    const { user_id } = req.session;
    
    //1.

    return res.json({ success: false, message: "This function is not complete yet." });
}

module.exports = {
    createAd,
    deleteAd,
    editAd,
    getAd,
    getAds
};
