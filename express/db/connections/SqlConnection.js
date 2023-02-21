require("dotenv").config({ path: `${__dirname}/../../.env` });
const { Sequelize, DataTypes, Model } = require("sequelize");
const { readdirSync } = require("fs");

const {
    PG_SUPER_USER,
    PG_SUPER_PASSWORD,
    PG_ADMIN_USER,
    PG_ADMIN_PASSWORD,
    PG_HOST,
    PG_PORT,
    PG_SUPER_DATABASE,
    PG_ADMIN_DATABASE,
    NODE_ENV
} = process.env;

function generateConfig(role) {
    const isSuperUser = role === "superUser" && NODE_ENV !== "production";
    return {
        username: isSuperUser ? PG_SUPER_USER : PG_ADMIN_USER,
        password: isSuperUser ? PG_SUPER_PASSWORD : PG_ADMIN_PASSWORD,
        host: PG_HOST,
        port: PG_PORT,
        database: isSuperUser ? PG_SUPER_DATABASE : PG_ADMIN_DATABASE,
        dialect: "postgres",
        ssl: false,
        logging: true,
        define: {
            freezeTableName: true,
            timestamps: false
        },
        pool: {
            max: 100,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000
        }
    };
}

class SqlConnection extends Sequelize {
    constructor(role) {
        if (!["jasmaAdmin", "superUser"].includes(role)) {
            throw new Error("Role provided must be jasmaAdmin or superUser");
        }
        super(generateConfig(role));
        this._role = role;
    }

    async initializeDatabase() {
        if (this._role !== "superUser") {
            throw new Error("Only initialize database as superUser");
        }

        const sql = `
        DROP DATABASE IF EXISTS jasma_db;
    
        CREATE DATABASE jasma_db
            WITH
            OWNER = postgres
            TEMPLATE = template0
            ENCODING = 'UTF8'
            LC_COLLATE = 'en_US.UTF-8'
            LC_CTYPE = 'en_US.UTF-8'
            TABLESPACE = pg_default
            CONNECTION LIMIT = -1
            IS_TEMPLATE = False;
    
        COMMENT ON DATABASE jasma_db
        IS 'Primary PS-SQL Database of JASMA';
    
        DROP ROLE IF EXISTS jasma_admin;
        
        CREATE ROLE jasma_admin WITH LOGIN PASSWORD '${process.env.PG_ADMIN_PASSWORD}';
        
        ALTER DATABASE jasma_db OWNER TO jasma_admin;
        `;

        const queries = sql.match(/^\w|\s[^;]+;$/gm);

        for (let i = 0; i < queries.length; i++) {
            const query = queries[i];
            await this.query(query);
        }
    }

    loadModels() {
        if (this._role !== "jasmaAdmin") {
            throw new Error("Only load models as jasmaAdmin");
        }
        const folderPath = `${__dirname}/../../models/`;
        const fileNames = readdirSync(folderPath);
        fileNames.forEach((fileName) => require(folderPath + fileName)(this, DataTypes, Model));
    }

    async createTables() {
        if (Object.keys(this.models).length === 0) {
            throw new Error("No models loaded. Call loadModels method on instance before attempting to create tables.");
        }

        if (this._role === "superUser") {
            throw new Error("Cannot create tables in superUser database");
        }
        await this.sync();
    }

    async getSchema(tableName) {
        const res = await this.query(
            `
            SELECT column_name, data_type
            FROM jasma_db.information_schema.columns
            WHERE table_name = ?;
            `,
            { replacements: [tableName] }
        );
        return res[0][0];
    }

    async tableExists(tableName) {
        const res = await this.query(
            `
            SELECT EXISTS (
            SELECT FROM pg_tables
            WHERE schemaname = 'public' AND tablename = ?
            );
            `,
            { replacements: [tableName] }
        );
        return res[0][0];
    }

    async getSizeOfDB() {
        const res = await this.query(
            `
            SELECT pg_size_pretty (pg_database_size ('jasma_db')) AS total_database_size;
            `
        );
        return res[0][0];
    }

    async getNumOfTableRows(tableName) {
        const res = await this.query(
            `
            SELECT COUNT(*) AS rowcount
            FROM ${tableName};
            `
        );
        return res[0][0];
    }
}

module.exports = { SqlConnection };
