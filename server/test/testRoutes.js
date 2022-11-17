const axios = require('axios');
require("dotenv").config({ path: `${__dirname}/../.env` });
const {
    testUser,
    testUserInfo,
    testUserMetadata,
    testUserPreferences,
    testUserPost,
    testUserPostHashtag,
    testUserPostComment} = require("./testUserData.js");

// Who needs a testing library/framework if you can write your own? :D

const {BASE_URL, PORT} = process.env;
const apiURL = `${BASE_URL}:${PORT}/api`;

function report(msg, functionName, testStatus) {
    console.log("========START==========");
    console.log("FUNCTION:");
    console.log('\x1b[33m%s\x1b[0m', functionName); //yellow
    console.log("TEST STATUS:");
    //Green text
    if (testStatus === "SUCCESS") {
        console.log('\x1b[32m%s\x1b[0m', testStatus);
    }
    //Red text
    else {
        console.log('\x1b[31m%s\x1b[0m', testStatus);
    }
    console.log('\x1b[34m%s\x1b[0m', "RESPONSE:"); //blue
    console.log(msg);
    console.log("========END============");
}

async function testResponse() {
    const response = await axios.get(`${BASE_URL}:${PORT}/test`);
    const data = await response.data;
    report(data, "testResponse", "SUCCESS");
}

async function testCreateAccount() {
    let testStatus = "FAIL";
    let data = null;
    try 
    {
        const response = await axios.post(`${apiURL}/user/createaccount`, {userData: testUser});
        data = await response.data;
        if (data === true) {
            testStatus = "SUCCESS";
        }
    }
    catch (e)
    {
        console.log(e);
    }

    report(data, "testCreateAccount", testStatus);
}

testResponse();
testCreateAccount();
console.log("Press CTRL+C to exit...");
