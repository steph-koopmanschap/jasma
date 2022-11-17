const db = require("./dbConfig");
const { userGen, userInfoGen, userMetaDataGen, userPreferencesGen } = require("./dataGenerator");

class Users {
    static async create() {
        await db.query(`
            CREATE TABLE IF NOT EXISTS users(
                user_id         UUID PRIMARY KEY,
                username        VARCHAR(25) UNIQUE NOT NULL,
                email           VARCHAR(50) UNIQUE NOT NULL,
                recovery_email  VARCHAR(50),
                user_password   CHAR(60) NOT NULL,
                phone           VARCHAR(20),
                recovery_phone  VARCHAR(20)
            );
            
            CREATE INDEX users_username_idx ON users (username);
            CREATE INDEX users_email_idx ON users (email);
        `);

        console.log("users table created");
    }

    static async drop() {
        await db.query(`DROP TABLE IF EXISTS users CASCADE`);
        console.log("users table dropped");
    }

    static async reset() {
        await this.drop();
        await this.create();
    }

    static async resetAndPopulate(role, n) {
        await this.reset();
        await this.populate(role, n);
    }

    static generate(role) {
        const user = userGen();
        console.log("user", user);
        const userInfo = userInfoGen(user.entry.user_id);

        const userMetaData = userMetaDataGen(user.entry.user_id, role);
        const userPreferences = userPreferencesGen(user.entry.user_id);
        return [user, userInfo, userMetaData, userPreferences];
    }

    static async populate(role, n) {
        for (let i = 0; i < n; i++) {
            const userEntries = this.generate(role);
            for (let j = 0; j < userEntries.length; j++) {
                const userEntry = userEntries[j];
                const query = db.generateQuery(userEntry);
                await db.query(query.text, query.params);
            }
        }
        console.log("user associated tables populated");
    }
}

module.exports = Users;
