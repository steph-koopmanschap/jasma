const express = require("express");
const isAuth = require("../middleware/isAuth.js");

const adsRouter = express.Router();

adsRouter.post("/createAd", isAuth, createAd);
//Delete a specific ad by ad ID
adsRouter.delete("/deleteAd/:adID", isAuth, deleteAd);
adsRouter.put("/editAd", isAuth, editAd);
//Get a specific ad by ad ID from a user
adsRouter.get("/getAd/:adID", isAuth, getAd);
//Get all ads of a specific user
adsRouter.get("/getAds", isAuth, getAds);

module.exports = { adsRouter };
