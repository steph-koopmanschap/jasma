const axios = require('axios');
require("dotenv").config({ path: `${__dirname}/../.env` });
const {
    testUser,
    testUserInfo,
    testUserMetadata,
    testUserPreferences,
    testUserPost,
    testUserPostComment,
    createTestUser,
    deleteTestUser} = require("./testUserData.js");

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

async function testDeletePost() {
    let testStatus = "FAIL";
    let data = null;
    try 
    {
        const response = await axios.delete(`${apiURL}/post/deletepost/${testUserPost.post_id}`);
        data = await response.data;
        if (data === testUserPost.post_id) {
            testStatus = "SUCCESS";
        }
    }
    catch (e)
    {
        console.log(e);
    }

    report(data, "testDeletePost", testStatus);
}

async function testCreatePost() {
    let testStatus = "FAIL";
    let data = null;
    try 
    {
        const response = await axios.post(`${apiURL}/post/createpost`, {postData: testUserPost});
        data = await response.data;
        if (data === true) {
            testStatus = "SUCCESS";
        }
    }
    catch (e)
    {
        console.log(e);
    }

    report(data, "testCreatePost", testStatus);
}

async function testGetPosts() {
    let testStatus = "FAIL";
    let data = null;
    try 
    {
        const response = await axios.get(`${apiURL}/post/getposts/${testUser.user_id}?limit=10`);
        data = await response.data;
        if (data[0].post_id === testUserPost.post_id) {
            testStatus = "SUCCESS";
        }
    }
    catch (e)
    {
        console.error(e);
    }

    report(data, "testGetPosts", testStatus);
}

async function testSearch() {
    let testStatus = "FAIL";
    let data = null;
    try 
    {
        const response = await axios.get(`${apiURL}/post/search/?q=${testUserPost.hashtags[0]}+${testUserPost.hashtags[1]}}&limit=10`);
        data = await response.data;
        if (data[0]?.hashtags[0] === testUserPost.hashtags[0]) {
            testStatus = "SUCCESS";
        }
    }
    catch (e)
    {
        console.error(e);
    }

    report(data, "testSearch", testStatus);
}

async function runTest() {
    await testResponse();
    await deleteTestUser();
    await testCreateAccount();
    await testDeletePost();
    await testCreatePost();
    await createTestUser();
    await testGetPosts();
    await testSearch();
    console.log("Press CTRL+C to exit...");
}

runTest();


