import Redis from "ioredis";
const redis = new Redis();

function extractSessionId(req) {
    return `sess:${req.headers.cookie.match(/(?<=connect.sid=s%3A)[^\.]*/)}`;
}
async function getSession(req) {
    const cookie = req.headers.cookie;
    if (cookie) {
        const sessionId = extractSessionId(req);
        const sessionDataString = await redis.get(sessionId);
        const sessionDataObject = JSON.parse(sessionDataString);
        return sessionDataObject;
    }
    return null;
}

async function checkAuth(req) {
    const session = await getSession(req);
    if (session && session.user_id) {
        return true;
    }
    return false;
}

export { getSession, checkAuth };
