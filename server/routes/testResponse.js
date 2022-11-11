//Just a simple test to see if the server responds
async function testResponse(req, res, next) {
    console.log("Received test.");
    try
    {
        return res.status(200).send("Test success from IP: " + req.ip);
    }
    catch (error)
    {
        console.log("Test failed.");
        console.log("500: Internal server error - " + error.message);
        res.status(500).send(error.message);
    }
}

module.exports = testResponse;
