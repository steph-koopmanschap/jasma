const searchFilter = require('../controllers/search/searchFilter.js');

//Example url
// /search?q=test+test123&limit=10&filter=hashtags
// Search filter options:
// hashtags
// posttext
// comments
// users
async function search(req, res, next) {
    try
    {
        let result = await searchFilter(req.query.q, req.query.limit, req.query.filter);
        if (result instanceof Error || result === null) 
        {
            return res.status(404).send(result);
        }
        return res.status(200).send(result);
    }
    catch (error)
    {
        console.log("500: Internal server error - " + error.message);
        res.status(500).send(error.message);
    }
}

module.exports = search;
