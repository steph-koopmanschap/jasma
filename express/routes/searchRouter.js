const express = require("express");
const { search } = require("../controllers/search.js")

const searchRouter = express.Router();

// api/search/search?q=KEYWORD&filter=FILTER_TYPE
searchRouter.get("/search", search);

module.exports = { searchRouter };
