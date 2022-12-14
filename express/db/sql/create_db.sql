-- Use this file to initialize the PostGreSQL database only once, before starting the server for the first time.

-- Drop jasma_db database if exists
DROP DATABASE IF EXISTS jasma_db;

-- Create jasma_db database as postgres user
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

-- Comment on database
COMMENT ON DATABASE jasma_db
    IS 'The Database for the JASMA App';

-- Drop jasma_admin role if exists
DROP ROLE IF EXISTS jasma_admin;

-- Create jasma_admin role
-- NOTE: LOGIN role is needed to create the database tables
CREATE ROLE jasma_admin WITH LOGIN PASSWORD 'a';

-- Pass ownership of jasma_db to jasma_admin
ALTER DATABASE jasma_db OWNER TO jasma_admin;

-- Disconnect from postgres user.
\q
