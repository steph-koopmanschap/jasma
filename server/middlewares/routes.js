//Router imports
const userRouter  = require("../routes/userRouter.js");
const postRouter  = require("../routes/postRouter.js");
const commentRouter = require("../routes/commentRouter.js");

function loadRouters(app)
{
    //Information about routes / routers
    const routingTable = [
        {route: '/api/user', name: userRouter},
        {route: '/api/post', name: postRouter},
        {route: '/api/comment', name: commentRouter}
    ];

    //Mount all the routers. See routing table for info.
    for (let i = 0; i < routingTable.length; i++)
    {
        app.use(routingTable[i].route, routingTable[i].name);
    }
}

module.exports = loadRouters;
