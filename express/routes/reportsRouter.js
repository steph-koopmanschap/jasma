const express = require("express");
const isAuth = require("../middleware/isAuth.js");
const isAuthIsMod = require("../middleware/isAuthIsMod.js");
const { createReport, 
        getReports,
        deleteReport,
        ignoreReport } = require("../controllers/reports.js");

const reportsRouter = express.Router();

// User creates a report on a post
reportsRouter.post("/createReport", isAuth, createReport);
// api/reports/getReports?limit=50
// If limit is 0 then all reports are fetched
reportsRouter.get("/getReports", isAuthIsMod, getReports);
// Delete a report AND delete the linked post
reportsRouter.delete("/deleteReport/:postID", isAuthIsMod, deleteReport);
// Delete a report, but do not delete the linked post. (Used for false reports)
reportsRouter.delete("/ignoreReport/:postID", isAuthIsMod, ignoreReport);

module.exports = { reportsRouter };
