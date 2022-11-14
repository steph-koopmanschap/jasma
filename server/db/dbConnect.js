const Pool = require("pg").Pool; //Postgres interface for nodejs

//Get PSQL credentials from .env
require('dotenv').config();
//require('dotenv').config( { path: `${__dirname}/../.env` } ); 
const { PG_USER, PG_PASSWORD, PG_HOST, PG_PORT, PG_DATABASE } = process.env;

//This file creates a connection to the PostGreSQL Database

//PSQL connection credentials and config
const config = {
    user: PG_USER,
    password: PG_PASSWORD, 
    host: PG_HOST,
    port: PG_PORT,
    database: PG_DATABASE,
    ssl: false,
    max: 5,
    //idleTimeoutMillis: 30000,
    //connectionTimeoutMillis: 2000
};

//Create the connection pool
const pool = new Pool(config);

module.exports = pool;

// NOTICE:
// When using transactions or a collection of SQL Queries that only function in a correct order
// Then using pool.query() is not allowed.
// FOR MORE INFO SEE: 
// https://www.postgresql.org/docs/8.3/tutorial-transactions.html
// https://node-postgres.com/features/transactions
// https://node-postgres.com/api/pool
// FROM THE DOCS:
/*
    Do not use pool.query if you need transactional integrity: 
    the pool will dispatch every query passed to pool.query on the first available idle client. 
    Transactions within PostgreSQL are scoped to a single client and so dispatching 
    individual queries within a single transaction across multiple, 
    random clients will cause big problems in your app and not work
*/

// Example of transaction code:
/*
async function myFunction() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await client.query('YOUR SQL QUERY', ['your_variables']);
    await client.query('YOUR SQL QUERY', ['your_variables']);
    await client.query('YOUR SQL QUERY', ['your_variables']);
    await client.query(('YOUR SQL QUERY', ['your_variables']);
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }
}
*/

//TEST CODE (DELETE LATER)

/*
return the client connections of the PSQL DB
async function getClient() {
    const client = new Client({
        host: process.env.PG_HOST,
        port: process.env.PG_PORT,
        user: process.env.PG_USER,
        password: process.env.PG_PASSWORD,
        database: process.env.PG_DATABASE,
        ssl: false,
    });

    await client.connect();
    return client;
}

(async () => {
    await client.connect();
    const res = await client.query('SELECT $1::text as connected', ['Connection to postgres successful!']);
    console.log(res.rows[0].connected);
    await client.end();
  })();
*/
