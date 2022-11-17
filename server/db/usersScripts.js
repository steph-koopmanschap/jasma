const db = require("./dbConfig");
const Users = require("./Users");

(async () => {
    const scriptName = process.env.npm_lifecycle_event;
    if (scriptName === "createUsers") {
        await Users.create();
    }
    if (scriptName === "dropUsers") {
        await Users.drop();
    }
    if (scriptName === "resetUsers") {
        await Users.reset();
    }
    if (scriptName === "populateUsers") {
        const args = process.argv.slice(2);
        await Users.populate(...args);
    }
    if (scriptName === "resetAndPopulateUsers") {
        const args = process.argv.slice(2);
        await Users.resetAndPopulate(...args);
    }

    await db.end();
})();
