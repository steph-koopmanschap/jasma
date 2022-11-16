const express     = require('express');
const getPosts    = require('./../controllers/post/getPosts.js');
const getPost     = require('./../controllers/post/getPost.js');
const searchPosts = require('./../controllers/post/searchPosts.js');
const createPost  = require('./../controllers/post/createPost.js');

// Create the post router
// The base URL for this router is URL:PORT/api/post/
const postRouter = express.Router();

//Retrieve a number of posts from a user
//Example url
// /getposts:userid?limit=10
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

//Retrieve posts by hashtags search
//Example url
// /search?q=test+test123&limit=10
postRouter.get('/search', async (req, res, next) => {
    try
    {
        //First get postIDs accociated with hashtags
        let postIDs = await searchPosts(req.query.q, req.query.limit);
        //Second retrieve the posts from the retrieved postIDs
        const posts = [];
        for (let i = 0; i < postIDs.length; i++)
        {
            let post = await getPost(postIDs[0]); 
            posts.push(post);
        }
        
        if (postIDs instanceof Error || postIDs === null || posts === []) 
        {
            return res.status(404).send(result);
        }
        return res.status(200).send(posts);
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
