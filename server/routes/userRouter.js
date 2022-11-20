const express    = require('express');
const rateLimit  = require('express-rate-limit'); //Rate limiter
const createUser = require('./../controllers/user/createUser.js');
// const searchUsers = require('./../controllers/user/searchUsers.js');
// Create the user router.
// The base URL for this router is URL:PORT/api/user/
const userRouter = express.Router();

//Limit the amount of times a user can create an account
const createAccountLimiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 1 hour
	max: 5, // Limit each IP to 5 create account requests per 'window' (here, per hour)
	message: 'Too many accounts created from this IP, please try again after an hour',
	standardHeaders: true, // Return rate limit info in the 'RateLimit-*' headers
	legacyHeaders: false, // Disable the 'X-RateLimit-*' headers
});

userRouter.post('/createaccount', createAccountLimiter, async (req, res, next) => {
    try
    {
        //Attach ip address to userData
        req.body.userData.last_ipv4 = req.ip;
        let result = await createUser(req.body.userData);
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

// userRouter.get('/search', async (req, res, next) => {
//     try
//     {
//         let result = await searchUsers(req.query.q, req.query.limit);
//         if (result instanceof Error || result === null) 
//         {
//             return res.status(404).send(result);
//         }
//         return res.status(200).send(result);
//     }
//     catch (error)
//     {
//         console.log("500: Internal server error - " + error.message);
//         res.status(500).send(error.message);
//     }
// });

module.exports = userRouter;
