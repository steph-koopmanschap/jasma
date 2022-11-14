const express    = require('express');
const getPosts   = require('./../controllers/post/getPosts.js');
const createPost = require('./../controllers/post/createPost.js');

// Create the post router
// The base URL for this router is URL:PORT/api/post/
const postRouter = express.Router();

//Retrieve a number of posts from a user
//Example url
// /retrievePosts:userid?limit=10
postRouter.get('/getposts:userid', async (req, res, next) => {
    try
    {
        let result = await getPosts(req.params.userid, req.query.limit);
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
});

postRouter.post('/createpost', async (req, res, next) => {
    try
    {
        let result = await createPost(req.body.userData);
        if (result instanceof Error || result === null) 
        {
            return res.status(404).send(result);
        }
        return res.status(201).send(result);
    }
    catch (error)
    {
        console.log("500: Internal server error - " + error.message);
        res.status(500).send(error.message);
    }
});

module.exports = postRouter;
