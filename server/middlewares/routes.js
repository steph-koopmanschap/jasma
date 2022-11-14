//Router imports
const userRouter  = require("../routes/userRouter.js");

function loadRouters(app)
{
    //Information about routes / routers
    const routingTable = [
        {route: '/api/user', name: userRouter},
    ];

    //Mount all the routers. See routing table for info.
    for (let i = 0; i < routingTable.length; i++)
    {
        app.use(routingTable[i].route, routingTable[i].name);
    }
}

module.exports = loadRouters;
