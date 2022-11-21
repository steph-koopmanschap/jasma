const db = require("./sequelizeConnect");
const { User, generateUser } = require("../models/User");

(async () => {
    const scriptName = process.env.npm_lifecycle_event;

    if (scriptName === "initializeDb") {
        db.sync({ force: true });
    }

    if (scriptName === "resetDb") {
        await db.drop();
        await db.sync();
    }

    if (scriptName === "syncUsers") {
        await User.sync();
    }

    if (scriptName === "dropUsers") {
        await User.drop({ cascade: true });
    }

    if (scriptName === "resetUsers") {
        await User.drop({ cascade: true });
        await User.sync();
    }

    if (scriptName === "populateUsers") {
        const args = process.argv.slice(2);
        for (let i = 0; i < Number(args[0]); i++) {
            await User.create(generateUser());
        }
    }

    if (scriptName === "resetAndPopulateUsers") {
        const args = process.argv.slice(2);
        await User.drop({ cascade: true });
        await User.sync();
        for (let i = 0; i < Number(args[0]); i++) {
            await User.create(generateUser());
        }
    }

    await db.close();
})();
