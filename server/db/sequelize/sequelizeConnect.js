require("dotenv").config({ path: `${__dirname}/../.env` });
console.log(`${__dirname}`);
const { Sequelize } = require("sequelize");
const { PG_USER, PG_PASSWORD, PG_HOST, PG_PORT, PG_DATABASE } = process.env;
console.log(PG_USER);
const config = {
    username: PG_USER,
    password: PG_PASSWORD,
    host: PG_HOST,
    port: PG_PORT,
    database: PG_DATABASE,
    dialect: "postgres",
    ssl: false,
    define: {
        freezeTableName: true,
        timestamps: false
    },
    query: {
        raw: true
    },
    pool: {
        max: 5
        //idleTimeoutMillis: 30000,
        //connectionTimeoutMillis: 2000
    }
};
const sequelize = new Sequelize(config);
module.exports = sequelize;
