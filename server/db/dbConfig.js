require("dotenv").config({ path: `${__dirname}/../.env` });
const { Client } = require("pg");
const { PG_USER, PG_PASSWORD, PG_HOST, PG_PORT, PG_DATABASE } = process.env;
const connectionString = `postgresql://${PG_USER}:${PG_PASSWORD}@${PG_HOST}:${PG_PORT}/${PG_DATABASE}`;
const client = new Client({ connectionString });
client.connect();

module.exports = {
    query: (text, params) => client.query(text, params),
    end: () => client.end().then(() => console.log("client disconnected")),
    generateQuery: (entry) => {
        const { tableName, columnNames, columnValues } = entry;
        const text = `INSERT INTO ${tableName} (${columnNames}) VALUES (${columnNames.map((_, i) => `$${i + 1}`)})`;
        const params = columnValues;
        return { text, params };
    }
};