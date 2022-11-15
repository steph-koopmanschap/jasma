const db = require("./dbConfig");
const gen = require("./dataGenerator");

async function getSchema(tableName) {
    const res = await db.query(
        `
        SELECT column_name, data_type
        FROM jasma_db.information_schema.columns
        WHERE table_name = $1;
        `,
        [tableName]
    );
    return res.rows;
}

async function tableExists(tableName) {
    const res = await db.query(
        `
        SELECT EXISTS (
        SELECT FROM pg_tables
        WHERE schemaname = 'public' AND tablename = $1
        );
        `,
        [tableName]
    );
    return res.rows[0].exists;
}

//Get the total size of the database in kb, mb, or gb
//returns string
async function getSizeOfDB() {
    const res = await db.query(
        `
        SELECT pg_size_pretty (pg_database_size ('jasma_db')) AS total_database_size;
        `
    );

    return res.rows[0].total_database_size;
}

//This can be useful for analytics 
//for example getNumOfTableRows(users) returns the number of registered users on jasma.
//Returns integer
async function getNumOfTableRows(tableName) {
    const res = await db.query(
        `
        SELECT COUNT(*) AS rowcount
        FROM ${tableName}
        `
    );

    return res.rows[0].rowcount;
}

async function run() {
    const exists = await tableExists("users");
    const schema = await getSchema("users");
    console.log(exists, schema, gen.givenName());
    await db.end();
}

run();

module.exports = {
    getSchema,
    tableExists,
    getSizeOfDB,
    getNumOfTableRows
}
