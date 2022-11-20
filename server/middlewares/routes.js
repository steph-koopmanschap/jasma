//Router imports
const userRouter  = require("../routes/userRouter.js");
const postRouter  = require("../routes/postRouter.js");
const commentRouter = require("../routes/commentRouter.js");
//Import single routes
const testResponse = require("../routes/testResponse.js");
const search = require("../routes/search.js");

function loadRouters(app)
{
    //Information about routes and routers
    //Use method: "router" for routers
    //Use other methods for single routes (not inside a router)
    const routingTable = [
        {route: '/api/user', name: userRouter, method: "router"},
        {route: '/api/post', name: postRouter, method: "router"},
        {route: '/api/comment', name: commentRouter, method: "router"},
        {route: '/api/search', name: search, method: "get"},
        {route: '/test', name: testResponse, method: "all"}
    ];

    //Mount all the routers. See routing table for info.
    for (let i = 0; i < routingTable.length; i++)
    {
        switch (routingTable[i].method) 
        {
            case 'router':
                app.use(routingTable[i].route, routingTable[i].name);
            case 'all':
                app.all(routingTable[i].route, routingTable[i].name);
            case 'get':
                app.get(routingTable[i].route, routingTable[i].name);
            case 'post':
                app.post(routingTable[i].route, routingTable[i].name);
            case 'put':
                app.put(routingTable[i].route, routingTable[i].name);
            case 'delete':
                app.delete(routingTable[i].route, routingTable[i].name);
            default:
                break;
        }
    }
}

module.exports = loadRouters;
