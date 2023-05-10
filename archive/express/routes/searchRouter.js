const express = require("express");
const { searchLimiter } = require("../middleware/rateLimiters");
const { search } = require("../controllers/search.js")

const searchRouter = express.Router();

// api/search/search?q=KEYWORD&filter=FILTER_TYPE
searchRouter.get("/search", searchLimiter, search);

module.exports = { searchRouter };
