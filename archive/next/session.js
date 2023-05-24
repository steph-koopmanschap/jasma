//This file became broken?

/*

./node_modules/ioredis/built/cluster/ClusterOptions.js:4:0
Module not found: Can't resolve 'dns'

Import trace for requested module:
./node_modules/ioredis/built/cluster/index.js
./node_modules/ioredis/built/index.js
./session.js
./pages/dashboard.js

*/

// import Redis from "ioredis";
// const redis = new Redis();

// function extractSessionId(req) {
//     return `sess:${req.headers.cookie.match(/(?<=connect.sid=s%3A)[^\.]*/)}`;
// }
// async function getSession(req) {
//     const cookie = req.headers.cookie;
//     if (cookie) {
//         const sessionId = extractSessionId(req);
//         const sessionDataString = await redis.get(sessionId);
//         const sessionDataObject = JSON.parse(sessionDataString);
//         return sessionDataObject;
//     }
//     return null;
// }

// async function checkAuth(req) {
//     const session = await getSession(req);
//     if (session && session.user_id) {
//         return true;
//     }
//     return false;
// }

// export { getSession, checkAuth };
