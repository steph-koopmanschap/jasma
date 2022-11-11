const db = require("./dbConfig");

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

async function run() {
    await tableExists("users");
    await getSchema("users");
    await db.end();
}

run();
